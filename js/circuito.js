class Circuito {
    "use strict:"
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob){
            this.canUseFile = true    
        } else {
            this.canUseFile = false
        }
    }

    processFile(files){
        if (this.canUseFile){
            let file = files[0] 
            let type1 = "application/xml"
            let type2 = "text/xml"

            if (file.type.match(type1) || file.type.match(type2)){

                let lector = new FileReader()
                lector.onload = function (event) {
                    let xmlAsString = lector.result
                    
                    const parser = new DOMParser()
                    const xmlAsDom = parser.parseFromString(xmlAsString, type1)
                    let circuito = $(xmlAsDom).find("circuito")
                    console.log(circuito)
                } 
                lector.readAsText(file)
            } else {
                alert("not valid file MIME") //provisional
            }
        } else {
            alert("not valid browser") //provisional
        }
        
        
    }
}

const circuito = new Circuito()