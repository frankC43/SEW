class Agenda {
    "use strict:"
    constructor (url){
        this.url = url
    }

    getRaceSchedules(){
        $.ajax({
            dataType: "json",
            url: this.url,
            method: "GET",
            success: function(datos) {
                $(datos.MRData.RaceTable.Races).each(function (i, race) {
                    let raceName = race.raceName
                    let circuit = race.Circuit.circuitName
                    let lat = race.Circuit.Location.lat
                    let lon = race.Circuit.Location.long
                    let date = race.date

                    let article = $("<article></article>")
                    let img = $("<img>")
                                .attr("src", "multimedia/imagenes/calendario.png")
                                .attr("alt","Icono de agenda")
                                
                    article.append(img)
                    article.append("<h4>Nombre de la Carrera: "+raceName+"</h4>")
                    article.append("<p>Nombre del circuito: "+circuit+"</p>")
                    article.append("<p>Latitud: "+lat+"</p>")
                    article.append("<p>Longuitud: "+lon+"</p>")
                    article.append("<p>Día de la carrera: "+date+"</p>")

                    $(document).ready(function () {
                        $("body main section").append(article)
                    })
                })
            },
            error: function (){
                console.log("Error en la solicitud")
            }
        })
        //Remove the addition of more raceSchedules once are all added
        let btn = document.querySelector("main button")
        btn.onclick = null
    }
}

var agenda = new Agenda("https://api.jolpi.ca/ergast/f1/current")