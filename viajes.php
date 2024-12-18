<?php
    class Carrusel {
     
        private $fotos;
        private $params;


        public function __construct($nombreCapital, $nombrePais) {
            $this->params = array(
                "api_key" => "35b9e8e93483312c8dd3f954a50bcbd8",
                "method" => "flickr.photos.search",
                "format" => "php_serial",
                "per_page" => "10",
                "pages" => "1",
                "text" => $nombreCapital,
                "tags" => $nombrePais.", city",
            );
            $encoded_params = array();
            foreach( $this->params as $k => $v ) {
                $encoded_params[] = urlencode( $k ) ."=". urlencode( $v );
            }
            $url = "https://www.flickr.com/services/rest/?".implode("&", $encoded_params);
            $response_flickr = file_get_contents($url);
            $response_obj = unserialize($response_flickr);
            if ( $response_obj["stat"] === "ok") {
                $this->fotos = array();
                for ($i = 0; $i < count($response_obj["photos"]["photo"]); $i++) {
                    $imgSrc = $response_obj["photos"]["photo"][$i];
                    $this->fotos[] = "https://farm".$imgSrc["farm"].".staticflickr.com/".$imgSrc["server"]."/".$imgSrc["id"]."_".$imgSrc["secret"]."_w.png";
                }
            } else {
                exit("<h2>ERROR al llamar a flickr</h2>");
            }
        }

        function getImages() {
            for( $i = 0; $i < count($this->fotos) ; $i++){
                print "<img src='".$this->fotos["".$i]."' alt='Imagen del carrusel ".$i."'>";
            }
        }
    }
    $carrusel = new Carrusel("Manama", "Bahrein")
?>
<?php
    class Moneda {
        private $params;
        private $url;
        
        function __construct($moneyCodeLocal, $moneyCodeThere) {
            $this->params = array(
                "access_key"=>"b4dde78cf854b4f23622f29d4e0b2305",
                "base"=>"EUR",
                "symbols" => "BHD"
            );
            $encoded_params = array();
            foreach( $this->params as $k => $v ) {
                $encoded_params[] = urlencode( $k ) ."=". urlencode( $v );
            }
            $this->url = "http://api.exchangeratesapi.io/v1/latest?".implode("&", $encoded_params);
        }
        function getCambio(){
            $response = file_get_contents($this->url);
            $json = json_decode($response, true);
            if($json["success"] === true) {
                $rate = $json["rates"]["BHD"];
                $result = 1* $rate;
                echo "<p>".$result." BHD (Dinar bareiní)</p>";
            } else {
                exit("ERROR al llamar a la api de cambio de moneda. El JSON no fue exitoso");
            }

        }
    }
    $moneda = new Moneda("EUR","BHD");
?>
<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="UO294768-Francisco Cimadevilla"/>
    <meta name="description" content="Documento de la web F1 Desktop con información referente a la hoja de ruta del gran premio de Fórmula 1"/>
    <meta name="keywords" content="Formula 1 Viajes, Viajes F1"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <title>F1 Desktop - Viajes</title>
    <link href="multimedia/imagenes/favicon-lance-stroll.jfif" rel="icon">
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css"/>
    <script async defer src=
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyCG2TuPk4XC9L5T6hnCm2afquBx4De-too&loading=async">
    </script>
    <script src="js/viajes.js"></script>
</head>

<body>
    <header>
        <h1><a href="index.html" title="Inicio">F1 Desktop</a></h1>
        <nav>
            <a href="index.html" title="Página principal">Inicio</a>
            <a href="piloto.html" title="Información de pilotos">Piloto</a>
            <a href="noticias.html" title="Últimas noticias">Noticias</a>
            <a href="calendario.html" title="Ver el calendario">Calendario</a>
            <a href="meteorologia.html" title="Condiciones del clima">Meteorología</a>
            <a href="juegos.html" title="Acceder a juegos">Juegos</a>
            <a href="circuito.html" title="Detalles del circuito">Circuito</a>
            <a href="viajes.php" title="Sección de viajes" class="active">Viajes</a>
        </nav>
    </header>

    <p><a href="index.html" title="Inicio">Inicio</a> >> Viajes</p>

    <main>
        <h2>Viajes</h2>
        <section>
            <h3>Mapa Estático</h3>
            <button onclick="viajes.getStaticMap()">Ver Mapa Estático</button>
        </section>

        <section>
            <h3>Mapa Dinámico</h3>
            <button onclick="viajes.esperarPorGoogle(() =>  viajes.initDynamicMap() )">Ver Mapa Dinámico</button>
        </section>

        <section>
            <h3>Carrusel de imágenes</h3>
            <figure>
                <?php $carrusel->getImages();?>
            </figure>
            <button aria-label="Mover la imagen del carrusel a la derecha"> &gt; </button>
            <button aria-label="Mover la imagen del carrusel a la izquierda"> &lt; </button>
        </section>
        <script 
            src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous">
        </script>
        <script>viajes.createCarrusel()</script>
        <section>
            <h3>Cambio de moneda</h3>
            <p>1 EUR equivale a</p>
            <?php $moneda->getCambio()?>
        </section>
    </main>
    <footer></footer>
</body>
</html>