class Circuito {
    "use strict:"
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob){
            this.canUseFile = true    
        } else {
            this.canUseFile = false
        }
    }

    processXmlFile(files){
        if (this.canUseFile){
            let file = files[0] 
            let type1 = "application/xml"
            let type2 = "text/xml"
            
            let isAlreadyOpened= document.querySelector("main section:first-of-type article")
            if (isAlreadyOpened != undefined)
                isAlreadyOpened.remove()

            if (file.type.match(type1) || file.type.match(type2)){

                let lector = new FileReader()
                lector.onload = function (event) {
                    let xmlAsString = lector.result
                    
                    const parser = new DOMParser()
                    const xmlAsDom = parser.parseFromString(xmlAsString, type1)
                    let circuito = $(xmlAsDom).find("circuito")

                    let container = $("<article></article>")
                    Array.from(circuito[0].children).forEach( node=>{
                        this.xmlToHtml(node, container)
                    }
                    )
                    $("main section:first-of-type").append(container)

                }.bind(this) 
                lector.readAsText(file)
            } 
        }
    }

    xmlToHtml(TreeNode, container){

        switch(TreeNode.nodeName){
            case 'nombre':
                container.append(
                    '<h1>'+TreeNode.textContent+'</h1>'
                )
                break;
            case 'pais':
            case 'fecha':
            case 'vueltas':
                    container.append(
                        '<p>'+TreeNode.nodeName+': '+TreeNode.textContent+'</p>'
                    )
                    break;
            case 'horaInicio':
                container.append(
                    '<p>Hora de inicio: '+TreeNode.textContent+'</p>'
                )
                break;
            case 'localidad':
            case 'longitud':
            case 'anchura':
                container.append(
                    '<p>'+TreeNode.nodeName+': '+TreeNode.textContent+' '+TreeNode.getAttribute("measure")+'</p>'
                )
                break;
            case 'referencias':
                let refs = $("<ul></ul>") 
                Array.from(TreeNode.children).forEach( node =>{
                        refs.append(
                            $("<li></li>").append(
                                $("<a></a>")
                                    .attr("href",node.getAttribute("webSource"))
                                    .text(node.textContent)
                            )
                        )   
                    }
                )
                container.append("<h2>Referencias<h2>")
                container.append(refs)
                break;
            case 'fotos':
                let fotos = $("<section></section>")
                Array.from(TreeNode.children).forEach(node => {
                    fotos.append(
                        $("<img>")
                            .attr("src", node.getAttribute("img"))
                            .attr("alt", node.getAttribute("alt"))
                    )
                })
                container.append("<h2>Fotos<h2>")
                container.append(fotos)
                break;
            case 'videos':
                let videos = $("<section></section>")
                Array.from(TreeNode.children).forEach(node => {
                        let video = $("<video></video>")
                            .attr("controls", true)
                        let source = $("<source>")
                            .attr("src", node.getAttribute("src")) 
                        video.append(source)
                        videos.append(video)
                })
                container.append("<h2>Videos<h2>")
                container.append(videos)
                break;
            case 'coordenada':
                let coordList = $("<section></section>")
                let items = $("<ul></ul>") 
                Array.from(TreeNode.children).forEach( node =>{
                        let name = node.nodeName.substring(3, node.nodeName.length)
                        items.append(
                            $("<li></li>")
                                .text(name+": "+node.textContent)
                        )   
                    }
                )
                coordList.append(items)
                container.append("<h2>Coordenadas Circuito<h2>")
                container.append(coordList)
                break;
            case 'tramos':
                let tramosTable = $("<table></table>")  
                tramosTable.append(
                    "<thead>\
                        <tr> \
                            <th scope='col' id='tipoTramo'>Tipo de tramo</th>\
                            <th scope='col' id='longitudTramo'>Longitud (m)</th>\
                            <th scope='col' id='longitudGeo'>Longitud (Grados)</th>\
                            <th scope='col' id='latitudGeo'>Latitud (Grados)</th>\
                            <th scope='col' id='altitudGeo'>Altitud (m)</th>\
                            <th scope='col' id='numeroTramo'>Número de tramo</th>\
                        </tr>\
                    </thead>\
                    <tbody></tbody>"
                )

                $(TreeNode.children).each( function () {
                    let row = $("<tr></tr>");
                    let tipo = $(this).attr("tipo")
                    let longitud = $(this).find("longitud").text()
                    let numeroTramo =  $(this).find("numeroTramo").text()

                    const coord = $(this).find("coordenada")
                    let cooLongitud = coord.find("cooLongitud").text() 
                    let cooLatitud = coord.find("cooLatitud").text() 
                    let cooAltitud = coord.find("cooAltitud").text() 
                    
                    row.append(`
                        <th scope="row" id="tipo-${numeroTramo}" headers="tipoTramo">${tipo}</th>
                        <td headers="tipo-${numeroTramo} longitudTramo">${longitud}</td>
                        <td headers="tipo-${numeroTramo} longitudGeo">${cooLongitud}</td>
                        <td headers="tipo-${numeroTramo} latitudGeo">${cooLatitud}</td>
                        <td headers="tipo-${numeroTramo} altitudGeo">${cooAltitud}</td>
                        <td headers="tipo-${numeroTramo} numeroTramo">${numeroTramo}</td>
                    `);
        
                    tramosTable.find("tbody").append(row);
                    
                })
                container.append("<h2>Tramos</h2>")
                container.append(tramosTable)
                break;
            default:
                break;
        }
        
    }

    processKmlFile(files){
        if (this.canUseFile){
            let file = files[0] 
            
            let isAlreadyOpened= document.querySelector("main section:first-of-type div")
            if (isAlreadyOpened != undefined)
                isAlreadyOpened.remove()
            
            let type = file.name.substring(file.name.length-4,file.name.length)
            
            if (type == ".kml"){

                let lector = new FileReader()
                lector.onload = function (event) {
                    let kmlAsString = lector.result
                    
                    const parser = new DOMParser()
                    const kmlAsDom = parser.parseFromString(kmlAsString, "application/xml")
                    let coordinates = $(kmlAsDom).find("coordinates")

                    let container = document.querySelector("main section:nth-of-type(2) div")

                    this.showKmlDynamicMap(coordinates, container)

                   
                }.bind(this) 
                lector.readAsText(file)
            } 
        }
    }

    showKmlDynamicMap(coordinates, container){
        let coordJSON = $(coordinates)
                            .text()
                            .trim()
                            .split(/\s/)
                            .map(coord => {
                                const [long, lat, alt] = coord.split(",").map(Number)
                                return {long, lat, alt}
                            })
        let mapKml = 
            new google.maps.Map(container,{
                zoom: 15,
                center: { lat:coordJSON[0].lat, lng:coordJSON[0].long} ,
                mapTypeId: google.maps.MapTypeId.roadmap
                })

        coordJSON.forEach((coord,i) => {
            new google.maps.Marker({
                position: { lat:coord.lat,lng:coord.long },
                map: mapKml,
                title: "Point: "+(i+1)+"Altitude: "+coord.alt+"m"
            })
        })
        
        let polyline = 
            new google.maps.Polyline({
                path: coordJSON.map(coord=> { return {lat: coord.lat, lng: coord.long} }),
                geodesic: true,
                strokeColor: "#FF0000", //red
                strokeOpacity: 1.0,
                strokeWeight: 2 //grosor
            })
        
        polyline.setMap(mapKml)
        
    }

    insertSvg(files){
        if (this.canUseFile){
            let file = files[0] 
            
            let isAlreadyOpened= document.querySelector("main section:nth-of-type(3) svg")
            if (isAlreadyOpened != undefined)
                isAlreadyOpened.remove()
            
            let type = file.name.substring(file.name.length-4,file.name.length)
            
            if (type == ".svg"){

                let lector = new FileReader()
                lector.onload = function (event) {
                    let svgAsString = lector.result
                    
                    const parser = new DOMParser()
                    const svgAsDom = parser.parseFromString(svgAsString, "application/xml")
                    let svg = $(svgAsDom).find("svg")
                    
                    $("main section:nth-of-type(3)").append(svg)
                   
                }.bind(this) 
                lector.readAsText(file)
            } 
        }
    }
}

const circuito = new Circuito()
