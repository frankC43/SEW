class Noticias{
    "use strict:"
    constructor(){
        if (Window.File && Window.FileReader && Window.FileList && Window.Blob){
            this.readInputFile();    
        }
    }

    readInputFile(files){
        let file = files[0]
        let textType = /text.*/

        if (file.type.match(textType)){
            
            let lector = new FileReader()
            lector.onload = function (event) {
                let lines = lector.result.split('\n');
                
                lines.forEach(line => {

                    if (line.trim() === '') 
                        return;

                    let text = line.split("_");
                    if (text.length >= 3) {
                        let article = $("<article></article>");
                        
                        let img = $("<img>")
                            .attr("src", "multimedia/imagenes/newsIcon.jpg")
                            .attr("alt", "Icono de noticias");
                        
                        article.append(img);
                        
                        article.append("<p>Titular: " + text[0].trim() + "</p>");
                        article.append("<p>Entradilla: " + text[1].trim() + "</p>");
                        article.append("<p>Autor: " + text[2].trim() + "</p>");
                        
                        $("body main section").append(article);
                    }
                });
            }
            lector.readAsText(file)
        }

    }

    add(){
        let listInfo = []
        $("section:last").find("input").each(function () {
            listInfo.push($(this).val())
        })
        $("section:last").find("textarea").each(function () {
            listInfo.push($(this).val())
        })
        
        if (listInfo.length < 3)
            return;

        let article = $("<article></article>");
                        
        let img = $("<img>")
            .attr("src", "https://static.vecteezy.com/system/resources/previews/026/002/795/original/news-icon-digital-marketing-concept-outline-icon-vector.jpg")
            .attr("alt", "Icono de noticias");
        
        article.append(img);
        
        article.append("<h4>Titular: " + listInfo[0] + "</h4>");
        article.append("<p>Entradilla: " + listInfo[1] + "</p>");
        article.append("<p>Autor: " + listInfo[2] + "</p>");
        
        $("body main section").append(article);

        //clean inputs
        $("section:last").find("input").each(function () {
            $(this).val("");
        });
        $("section:last").find("textarea").each(function () {
            $(this).val("");
        });
    }
}

const noticias = new Noticias()