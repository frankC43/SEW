<?php 
    class Datos {
        protected $server;
        protected $user;
        protected $pass;
        protected $dbname;
        public $conn;
        protected $currentDifficultyLevel;

        public function __construct(){
            $this->server = 'localhost';
            $this->user = 'DBUSER2024';
            $this->pass = 'DBPSWD2024';
            $this->dbname = 'datosf1';
        }

        private function getConn(){
            $this->conn = new mysqli(hostname: $this->server, username: $this->user, password: $this->pass, database: $this->dbname);
           
            if ($this->conn->connect_error){
                exit("<h2>ERROR conexión: ".$this->conn->connect_error."</h2>");
            }
        }

        private function closeConn() {
            $this->conn->close();
        }

        public function evaluateDbAction() {
            if (count($_POST) != 0) {
                if (isset($_POST["CargarDatos"])) {
                    $this->cargarDatos();
                }
                elseif (isset($_POST["InsertarDatos"])) {
                    $this->insertarDatos();
                }
                elseif (isset($_POST["ExportarDatos"])) {
                    $this->exportarDatos();
                }
            }
        }

        public function cargarDatos(){
            $this->getConn();
            $this->eliminarTablas();
            $this->crearTablas();
            $this->insertarCSV("./php/fichero.csv");   
            $this->closeConn();
        }

        public function eliminarTablas(){
            $this->conn->autocommit(false);
            $this->conn->begin_transaction();
            try {
                $this->conn->query("DROP TABLE IF EXISTS  piloto_temporada ");
                $this->conn->query("DROP TABLE IF EXISTS vehiculo");

                $this->conn->query("DROP TABLE IF EXISTS piloto");
                $this->conn->query("DROP TABLE IF EXISTS escuderia");
                $this->conn->query("DROP TABLE IF EXISTS pais");
                $this->conn->query("DROP TABLE IF EXISTS temporada");
                $this->conn->commit();
            } catch (Exception $e) {
                $this->conn->rollback();
                exit("Error deleting all the data Error msg=".$e->getMessage());
            }
        }

        public function crearTablas(){
            $this->conn->autocommit(false);
            
            try {
                $try_open = file_get_contents("./php/fichero.sql");
                if ($try_open !== false) {
                    $this->conn->begin_transaction();
                    $statements = explode(";", $try_open);

                    foreach ($statements as $statement) {
                        $statement = trim($statement); 
                        if (!empty($statement)) {
                            $this->conn->query($statement . ";");
                        }
                    }

                    $this->conn->commit();
                }
            }
            catch (Exception $e) {
                $this->conn->rollback();
                exit("Error: Tratando de crear las tablas en la base de datos. ErrorMessage=".$e->getMessage());
            }
        }

        public function insertarDatos(){
            if (isset($_FILES["archivoCSV"])){
                $file_temp_path = $_FILES["archivoCSV"]["tmp_name"];
                $file_type = $_FILES["archivoCSV"]["type"];
                if ($file_type === "text/csv") {
                    $this->getConn();
                    $this->insertarCSV($file_temp_path);
                    $this->closeConn();
                }
            }
        }

        public function exportarDatos(){
            $this->getConn();
            $query = $this->conn->query("SELECT id, nombre_pais FROM pais");
            $registroPais = [];
            while ($row = $query->fetch_assoc()) {
                $registroPais[] = implode("; ", ["pais", $row["id"], $row["nombre_pais"]]);
            }

            $query = $this->conn->query("SELECT id, año FROM temporada");
            $registroTemporada = [];
            while ($row = $query->fetch_assoc()) {
                $registroTemporada[] = implode("; ", ["temporada", $row["id"], $row["año"]]);
            }

            $query = $this->conn->query("SELECT id, nombre, apellido, nacimiento, id_pais FROM piloto");
            $registroPilotos = array();
            while ( $row = $query->fetch_assoc() ) {
                $registroPilotos[] = implode("; ", [
                    "piloto",
                    $row["id"],
                    $row["nombre"],
                    $row["apellido"],
                    $row["nacimiento"],
                    $row["id_pais"]
                ]);
            }

            $query = $this->conn->query("SELECT id, nombre_escuderia, id_pais FROM escuderia");
            $registroEscuderia = [];
            while ($row = $query->fetch_assoc()) {
                $registroEscuderia[] = implode("; ", ["escuderia", $row["id"], $row["nombre_escuderia"], $row["id_pais"]]);
            }

            $query = $this->conn->query("SELECT id_temporada, id_piloto, id_escuderia FROM piloto_temporada");
            $registroPilotoTemporada = [];
            while ($row = $query->fetch_assoc()) {
                $registroPilotoTemporada[] = implode("; ", ["piloto_temporada", $row["id_temporada"], $row["id_piloto"], $row["id_escuderia"]]);
            }

            $query = $this->conn->query("SELECT id, nombre_modelo, id_escuderia, id_temporada FROM vehiculo");
            $registroVehiculo = [];
            while ($row = $query->fetch_assoc()) {
                $registroVehiculo[] = implode("; ", [
                    "vehiculo", 
                    $row["id"], 
                    $row["nombre_modelo"], 
                    $row["id_escuderia"], 
                    $row["id_temporada"]
                ]);
            }
            $this->closeConn();

            $archivoCSV = fopen('./php/datos_exportados.csv', 'w');

            $tablas = [
                $registroPais,
                $registroTemporada,
                $registroPilotos,
                $registroEscuderia,
                $registroPilotoTemporada,
                $registroVehiculo,
            ];

            foreach ($tablas as $tabla) {
                foreach ($tabla as $linea) {
                    fwrite($archivoCSV, $linea . PHP_EOL); 
                }
            }

            fclose($archivoCSV);
        }

        /**
         * Lee un archivo csv donde el primer valor es la tabla a la que se refiere
         * @param mixed $filepath path al fichero csv del que extraemos la información
         */
        private function insertarCSV($filepath){
            $this->conn->autocommit(false);
            $this->conn->begin_transaction();

            $insert_into = "INSERT IGNORE INTO %s (%s) VALUES (%s)";
            $try_open = fopen($filepath,"r");

            if ($try_open !== false) {
                try {
                    while (($try_parse_csv = fgetcsv($try_open,0,";")) !== false) {
                        $table = $try_parse_csv[0];
                        foreach ($try_parse_csv as $key => $value) {
                            $array[$key] = trim($value);
                        }
                        switch ($table) {
                            case "piloto":
                                $query = sprintf($insert_into, "piloto", "id, nombre, apellido, nacimiento, id_pais", "?,?,?,?,?");
                                $prepSt = $this->conn->prepare($query);
                                $prepSt->bind_param("sssss", $try_parse_csv[1], $try_parse_csv[2], $try_parse_csv[3], $try_parse_csv[4], $try_parse_csv[5]);
                                $prepSt->execute();
                                $prepSt->close();
                                break;
                            case "escuderia":
                                $query = sprintf($insert_into,  "escuderia","id, nombre_escuderia, id_pais", "?,?,?");
                                $prepSt = $this->conn->prepare($query);
                                $prepSt->bind_param("sss", $try_parse_csv[1], $try_parse_csv[2], $try_parse_csv[3]);
                                $prepSt->execute();
                                $prepSt->close();
                                break;
                            case "temporada":
                                $query = sprintf($insert_into,  "temporada","id, año", "?,?");
                                $prepSt = $this->conn->prepare($query);
                                $prepSt->bind_param("ss", $try_parse_csv[1], $try_parse_csv[2]);
                                $prepSt->execute();
                                $prepSt->close();
                                break;
                            case "piloto_temporada":
                                $query = sprintf($insert_into,  "piloto_temporada","id_temporada, id_piloto, id_escuderia", "?,?,?");
                                $prepSt = $this->conn->prepare($query);
                                $prepSt->bind_param("sss", $try_parse_csv[1], $try_parse_csv[2], $try_parse_csv[3]);
                                $prepSt->execute();
                                $prepSt->close();
                                break;
                            case "pais":
                                $query = sprintf($insert_into,  "pais", "id, nombre_pais", "?,?");
                                $prepSt = $this->conn->prepare($query);
                                $prepSt->bind_param("ss", $try_parse_csv[1], $try_parse_csv[2]);
                                $prepSt->execute();
                                $prepSt->close();
                                break;
                            case "vehiculo":
                                $query = sprintf($insert_into,  "vehiculo", "id, nombre_modelo, id_escuderia, id_temporada", "?,?,?,?");
                                $prepSt = $this->conn->prepare($query);
                                $prepSt->bind_param("ssss", $try_parse_csv[1], $try_parse_csv[2], $try_parse_csv[3], $try_parse_csv[4]);
                                $prepSt->execute();
                                $prepSt->close();
                                break;
                        }
                    }
                    $this->conn->commit();
                } catch (Exception $e) {
                    $this->conn->rollback();
                    exit("Error during performing a csv data insertion in the DB. Error msg=".$e->getMessage());
                }
                
                fclose($try_open);
            }
        }

        /**
         * Recive de $_GET toda la informacion para filtrar que pilotos mostrar
         * y añade al html una serie de inputs de tipo submit para seleccionar un 
         * piloto especifico de la busqueda
         * 
         * Los parametros con valor 'cualquiera' no aplican ningún filtro a la búsqueda.
         * 
         */
        public function getPilotos(){
            if (isset($_GET["Buscar"]) && count($_GET) > 1) {
                
                $defaultField =  "cualquiera...";

                
                $nombre = $_GET["nombre"] === $defaultField ? "%" : "%".$_GET["nombre"]."%";
                $apellido = $_GET["apellido"] === $defaultField ? "%" : "%".$_GET["apellido"]."%";
                $edad = $_GET["edad"];
                $escuderia= $_GET["escuderia"] === $defaultField ? "%" : "%".$_GET["escuderia"]."%"; 
                $pais = $_GET["pais"] === $defaultField ? "%" : "%".$_GET["pais"]."%";


                $this->getConn();

                $query = "SELECT p.nombre, p.apellido, p.id 
                            FROM piloto as p 
                            WHERE p.nombre LIKE ? 
                            AND p.apellido LIKE ? 
                            AND TIMESTAMPDIFF(YEAR, p.nacimiento, CURDATE()) <= ? 
                            AND id_pais IN ( 
                                SELECT distinct pa.id 
                                FROM pais as pa 
                                WHERE pa.nombre_pais LIKE ?
                            ) 
                            AND p.id IN (
                                SELECT id_piloto 
                                FROM piloto_temporada as pt 
                                JOIN escuderia as e ON pt.id_escuderia = e.id 
                                WHERE e.nombre_escuderia LIKE ?
                            ) 
                            ORDER BY p.nombre ASC
                            LIMIT 10";
                
                $prepSt = $this->conn->prepare($query);
                $prepSt->bind_param("sssss", $nombre, $apellido, $edad, $pais, $escuderia);
                $prepSt->execute();
                $resultSet = $prepSt->get_result();
                
                while ( $row = $resultSet->fetch_assoc() ) {
                    echo "<li><input type='submit' name='Piloto' value='".$row["nombre"]." ".$row["apellido"]."'></li>";
                }

                $resultSet->close();
                $prepSt->close();
                $this->closeConn();
            }
        }

        /**
         * Recive de $_GET el id del piloto seleccionado y muestra toda la información 
         * relativa a dicho piloto en <articles>
         * 
         */
        public function getDatosPiloto(){
            if (isset($_GET["Piloto"])) {
                $piloto = preg_split('/\s+/', trim($_GET["Piloto"]));
                $this->getConn();
                echo "<section><h4>Piloto:</h4>";
                $this->pintarPiloto( $piloto);
                $this->pintarSusTemporadas($piloto);
                echo "</section>";
                
                $this->closeConn();
            }
        }

        private function pintarPiloto($piloto){
            $prepSt = $this->conn->prepare(
                "SELECT p.nacimiento, TIMESTAMPDIFF(YEAR, p.nacimiento, CURDATE()) as edad, pa.nombre_pais as pais
                            FROM piloto as p 
                            JOIN pais as pa ON p.id_pais = pa.id 
                            WHERE p.nombre LIKE ? 
                            AND p.apellido LIKE ?");
            $nombre = "%".$piloto[0]."%";
            $apellido = "%".$piloto[1]."%";
            
            $prepSt->bind_param("ss", $nombre, $apellido);
            $prepSt->execute();
            $result = $prepSt->get_result()->fetch_assoc();
            $prepSt->close();


            $article = "<article>";
            $article .= "<h3>".$piloto[0]." ".$piloto[1]."</h3>";
            $article .= "<ul>";
            $article .= "<li>Año nacimiento: ".$result["nacimiento"]."</li>";
            $article .= "<li>Edad actual: ".$result["edad"]."</li>";
            $article .= "<li>País de Origen: ".$result["pais"]."</li>";
            $article .= "</ul>";
            $article .= "</article>";
            echo $article;
        }
        private function pintarSusTemporadas($piloto){
            $prepSt = $this->conn->prepare(
                "SELECT t.año, e.nombre_escuderia, v.nombre_modelo
                            FROM piloto as p 
                            JOIN piloto_temporada as pt ON pt.id_piloto = p.id 
                            JOIN temporada as t ON pt.id_temporada = t.id 
                            JOIN escuderia as e ON pt.id_escuderia = e.id 
                            JOIN vehiculo as v ON v.id_escuderia = e.id AND v.id_temporada = t.id
                            WHERE p.nombre LIKE ? 
                            AND p.apellido LIKE ?
                            ORDER BY t.año DESC");
            $nombre = "%".$piloto[0]."%";
            $apellido = "%".$piloto[1]."%";
             
            $prepSt->bind_param("ss", $nombre, $apellido);
            $prepSt->execute();
            $resultSet = $prepSt->get_result();
            $prepSt->close();

            
            while ($row = $resultSet->fetch_assoc()){
                
                $article = "<article>";
                $article .= "<h3> Temporada de ".$row["año"]."</h3>";
                $article .= "<ul>";
                $article .= "<li>Escudería: ".$row["nombre_escuderia"]."</li>";
                $article .= "<li>Vehículo: ".$row["nombre_modelo"]."</li>";
                $article .= "</ul>";
                $article .= "</article>";
                echo $article;
            }
        }
    }
    $datos = new Datos();
    $datos->evaluateDbAction();
    ?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="UO294768-Francisco Cimadevilla"/>
    <meta name="description" content="Aplicación que simula una base de datos privada de la F1 para consultas sobre un piloto"/>
    <meta name="keywords" content="Formula 1 Piloto, F1 Piloto, Escuderias F1, Vehiculos F1"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <title>F1 Desktop - Base de datos privada</title>
    <link href="multimedia/imagenes/favicon-lance-stroll.jfif" rel="icon">
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css"/>
    <link rel="stylesheet" type="text/css" href="estilo/datos.css"/>
    
</head>

<body>
    <header>
        <h1><a href="./index.html" title="Inicio">F1 Desktop</a></h1>
        <nav>
            <a href="index.html" title="Página principal">Inicio</a>
            <a href="piloto.html" title="Información de pilotos">Piloto</a>
            <a href="noticias.html" title="Últimas noticias">Noticias</a>
            <a href="calendario.html" title="Ver el calendario">Calendario</a>
            <a href="meteorologia.html" title="Condiciones del clima">Meteorología</a>
            <a href="juegos.html" title="Acceder a juegos">Juegos</a>
            <a href="circuito.html" title="Detalles del circuito">Circuito</a>
            <a href="viajes.php" title="Sección de viajes">Viajes</a>
        </nav>
    </header>

    <p><a href="./index.html" title="Inicio">Inicio</a> >> <a href="./juegos.html" title="Juegos">Juegos</a> >> Aplicación Base de Datos</p>

    <aside>
        <h2>Menú de Juegos</h2>
        <ul>
            <li><a href="./memoria.html" title="Juego de Memoria">Juego de Memoria</a></li>
            <li><a href="./semaforo.php" title="Juego del Semaforo">Juego del Semáforo</a></li>
            <li><a href="./api.html" title="Aplicación con APIs">Aplicación con APIs</a></li>
        </ul>
    </aside>
    <main>
        <h2>Base de Datos Privada F1</h2>
        <p>Consulta toda la información que hayas guardado sobre los pilotos de la Fórmula 1.</p>
        <section>
            <h3>Operaciones en la base de datos...</h3>
            <form action="#" method="POST">
                <input type="submit" name="CargarDatos" value="Cargar tablas y datos">
            </form>
            <form action="#" method="POST" enctype="multipart/form-data">
                <label>
                    Insertar datos (csv): 
                    <input type="file" name="archivoCSV" required>
                </label>
                <input type="submit" name="InsertarDatos" value="Insertar datos">
            </form>
            <form action="#" method="POST">
                <input type="submit" name="ExportarDatos" value="Exportar datos">
            </form>
        </section>
        <section>
            <h3>Buscar por datos históricos del piloto...</h3>
            <form action="#" method="GET">
                <label>
                    Nombre: <input type="text" name="nombre" value="cualquiera..."> 
                </label>
                <label>
                    Apellido: <input type="text" name="apellido" value="cualquiera...">
                </label>
                <label>
                    Edad Máxima: <input type="number" name="edad" value="100">
                </label>
                <label>
                    Escudería: <input type="text" name="escuderia" value="cualquiera...">
                </label>
                <label>
                    País: <input type="text" name="pais" value="cualquiera...">
                </label>
                <input type="submit" name="Buscar" value="Buscar">
            </form>
            <form action="#" method="GET">
                <ol>
                    <?php $datos->getPilotos()?>
                </ol>
            </form>
        </section>
        <?php $datos->getDatosPiloto()?>
    </main>
    <footer>

    </footer>
</body>
</html>