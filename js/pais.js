
class Pais {

    "use strict:"
    constructor (nombrePais, nombreCapital, cantidadPoblacion){
        this.nombrePais = nombrePais
        this.nombreCapital = nombreCapital 
        this.cantidadPoblacion = cantidadPoblacion
        this.nombreCircuito
        this.coordenadaMeta
        this.religionMayoritaria
        this.formaGobierno
    }

    setNombreCircuito(nombreCircuito){
        this.nombreCircuito = nombreCircuito
    }

    setCoordenadaMeta(coordenadaMeta){
        this.coordenadaMeta = coordenadaMeta
    }

    setReligionMayoritaria(religionMayoritaria){
        this.religionMayoritaria = religionMayoritaria
    }

    setFormaGobierno(formaGobierno){
        this.formaGobierno = formaGobierno
    }

    getNombrePais(){
        return this.nombrePais.toString()
    }

    getNombreCapital(){
        return this.nombreCapital.toString()
    }

    getMoreInfo(){
        return [this.nombreCircuito, this.cantidadPoblacion, this.formaGobierno, this.religionMayoritaria]
    }

    writeCoordenadaMeta(){
        document.write("<p>Coordenada de meta: "+this.coordenadaMeta+"</p>")
    }

    searchWeatherInfo(){
        let coord = this.coordenadaMeta.split(",")
        let lat = coord[0].trim()
        let lon = coord[1].trim()
        let apiKey = "b3bd4eadb5bb9e302d5c5fa92666667f"
        
        let apiCall = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+apiKey+"&units=metric&mode=xml&lang=es"
            $.ajax({
                dataType: "xml",
                url: apiCall,
                method: "GET",
                success: function(datos){
                    
                    $(datos).find("time").each(function () {
                        let timeFrom = $(this).attr("from");

                        if (timeFrom && timeFrom.endsWith("09:00:00")) {

                            let time = new Date(timeFrom)
                            time.setTime(time.getTime() + 3 * 60 * 60 * 1000); //Le sumamos 3 horas por que Bahrein esta en GMT +03:00

                            let tempMin = $(this).find("temperature").attr("min");
                            let humidity = $(this).find("humidity").attr("value");
                            let symbolVar = $(this).find("symbol").attr("var");
                            let tempMax = $(this).find("temperature").attr("max");

                            let day = time.getDate().toString().padStart(2, "0");
                            let month = (time.getMonth() + 1).toString().padStart(2, "0"); // Los meses en JS son de 0 a 11
                            let year = time.getFullYear();

                            let hours = time.getHours().toString().padStart(2, "0");
                            let minutes = time.getMinutes().toString().padStart(2, "0");

                            let article = $("<article></article>");

                            let img = $("<img>").attr("src", "https://openweathermap.org/img/wn/"+symbolVar+"@2x.png").attr("alt", "Icono meteorológico"); 
                            article.append(img);

                            let dia = day+"/"+month+"/"+year
                            let hourFormat = hours+":"+minutes
                            article.append("<p>Día : "+dia+"</p>")

                            article.append("<p>Hora: "+hourFormat+"</p>");

                            article.append("<p>Temperatura Máxima: "+tempMax+" °C</p>");
                            
                            article.append("<p>Temperatura Mínima: "+tempMin+" °C</p>");

                            article.append("<p>Humedad: "+humidity+"%</p>");

                            $(document).ready(function () {
                                $("body main section").append(article)
                            })

                        }
                    })
                    
                }
            })
        
    }
}

const bahrein = new Pais("Bahreín", "Manama", "1,607,049")
bahrein.setNombreCircuito("Bahrain International Circuit")
bahrein.setCoordenadaMeta("26.03246166671207, 50.51049998681525")
bahrein.setFormaGobierno("Monarquía constitucional")
bahrein.setReligionMayoritaria("Islam")
let info = bahrein.getMoreInfo()

$(document).ready(function () {
    $("body main aside").append("<p>Nombre: "+bahrein.getNombrePais()+"</p>")
    $("body main aside").append("<p>Capital: "+bahrein.getNombreCapital()+"</p>")
    $("body main aside").append("<p>Cantidad Poblacion: "+info[1]+"</p>")
    $("body main aside").append("<p>Religión Mayoritaria: "+info[3]+"</p>")
    $("body main aside").append("<p>Forma de gobierno: "+info[2]+"</p>")
    $("body main aside").append("<p>Nombre Circuito: "+info[0]+"</p>")
})

bahrein.searchWeatherInfo()