<?php 
    class Record {
        private $server;
        private $user;
        private $pass;
        private $dbname;
        private $conn;
        private $currentDifficultyLevel;

        public function __construct(){
            $this->server = 'localhost';
            $this->user = 'DBUSER2024';
            $this->pass = 'DBPSWD2024';
            $this->dbname = 'records';

            $this->conn = new mysqli(hostname: $this->server, username: $this->user, password: $this->pass, database: $this->dbname);
           
            if ($this->conn->connect_error){
                exit("<h2>ERROR conexión: ".$this->conn->connect_error."</h2>");
            }
        }
        public function insertData(){
            if (count($_POST) != 0){
                $prepSt = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?,?,?,?) ");
                $this->currentDifficultyLevel = $_POST["nivel"];
                $prepSt->bind_param('ssss', $_POST["nombre"], $_POST["apellidos"], $_POST["nivel"], $_POST["tiempo"]);
                $prepSt->execute();
                $prepSt->close();
            }
        }

        public function getData(){
            if ($this->currentDifficultyLevel){
                $retTableInfo = $this->conn->query("SELECT * FROM registro WHERE nivel = ".$this->currentDifficultyLevel." ORDER BY tiempo ASC LIMIT 10");
                if ($retTableInfo->num_rows > 0) {

                    $section = "<section>";
                    $section .= "<h3>Mejores Resultados en el Juego del Semáforo Nivel: ".$this->currentDifficultyLevel."</h3>";
                    $section .= "<ul><li>Nombre\tApellidos\tTiempo (s)</li></ul>";
                    $html_ol = "<ol>";
                    while ($row = $retTableInfo->fetch_assoc()) {
                        $html_row = "<li>".$row["nombre"]."\t".$row["apellidos"]."\t".($row["tiempo"]/1000)."</li>";
                        $html_ol .= $html_row;
                    }
                    $html_ol .= "</ol>";
                    $section .= $html_ol . "</section>";
                    echo $section;
                }
            }
            
            $this->conn->close();
        }
    }
    $record = new Record();
    $record->insertData();
    ?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="UO294768-Francisco Cimadevilla"/>
    <meta name="description" content="Juego de memoria de la web F1 Desktop relacionado con los juegos de F1"/>
    <meta name="keywords" content="Formula 1 Juegos, F1 Juegos, Memoria, Cartas"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <title>F1 Desktop - Juego del Semáforo</title>
    <link href="multimedia/imagenes/favicon-lance-stroll.jfif" rel="icon">
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css"/>
    <link rel="stylesheet" type="text/css" href="estilo/semaforo.css"/>
    <script src="js/semaforo.js"></script>
    
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
            <a href="juegos.html" title="Acceder a juegos" class="activo">Juegos</a>
            <a href="circuito.html" title="Detalles del circuito">Circuito</a>
            <a href="viajes.php" title="Sección de viajes">Viajes</a>
        </nav>
    </header>

    <p><a href="./index.html" title="Inicio">Inicio</a> >> <a href="./juegos.html" title="Juegos">Juegos</a> >> Juego del Semáforo</p>

    <aside>
        <h2>Menú de Juegos</h2>
        <ul>
            <li><a href="memoria.html" title="Accede al Juego de Memoria">Juego de Memoria</a></li>
            <li><a href="api.html" title="Accede a la Aplicación con APIs">Aplicación con APIs</a></li>
            <li><a href="datos.php" title="Accede a la Aplicación Base de Datos">Aplicación Base de Datos</a></li>
        </ul>
    </aside>
    <main>
        <script>
                const semaforo = new Semaforo()
        </script>
    </main>
    <?php $record->getData() ?>
    <footer>

    </footer>
</body>
</html>