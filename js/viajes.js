class Viajes {
    "use strict:"
    constructor (){
        this.imgMap
        this.errorGeoLocal
        this.message 
        this.longitud          
        this.latitud            
        this.precision        
        this.altitud        
        this.precisionAltitud 
        this.rumbo            
        this.velocidad         
        this.coords
        this.apikey = "AIzaSyCG2TuPk4XC9L5T6hnCm2afquBx4De-too"
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this) )
    }

    getPosicion(posicion){
        this.message = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed; 
        this.coords = posicion.coords
        this.errorGeoLocal = false    

        this.getStaticMap()  
    }
    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.message = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.message = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.message = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.message = "Se ha producido un error desconocido"
            break;
        }
        this.errorGeoLocal = true

        this.getStaticMap()
    }

    getStaticMap() {
        let container = document.querySelector("body main section");
        if (! this.errorGeoLocal){
            if (this.imgMap == null){
                let url = "https://maps.googleapis.com/maps/api/staticmap?"
                let mapCenter = "&center="+this.latitud+","+this.longitud
                let zoom = "&zoom=15"
                let size = "&size=800x600"
                let label = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
                let format = "&format=png"
                let sensor = "&sensor=false"
                this.imgMap = url + mapCenter + zoom + size + label + sensor+ format + "&key="+this.apikey;
            }
            let img = document.createElement("img")
            img.src =  this.imgMap
            img.alt = "Mapa estático de su posición"
            container.appendChild(img) 
        } else {
            let mensaje = document.createElement("p")
            mensaje.setAttribute("text", this.message)
            container.appendChild(mensaje) 
        }
    }

    initDynamicMap(){
        let centerPos = {lat: this.coords.latitude, lng: this.coords.longitude}
        let div = document.querySelector("section:nth-of-type(2) div")

        let geoPosMap = 
            new google.maps.Map(div,{
                zoom: 10,
                center: centerPos,
                mapTypeId: google.maps.MapTypeId.roadmap
              })
        let window = new google.maps.InfoWindow
        
        if (!this.errorGeoLocal) {
            window.setPosition(centerPos)
            window.setContent(this.message)
            window.open(geoPosMap)
            geoPosMap.setCenter(centerPos)
        } else {
            window.setContent(this.message)
            window.open(geoPosMap)
        }
        
    }
}

var viajes = new Viajes()