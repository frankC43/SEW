class Semaforo{
    constructor() {
       this.levels = [0.2, 0.5, 0.8] 
       this.lights = 4
       this.unload_moment = null
       this.click_moment = null
       this.difficulty = this.levels[Math.floor(Math.random()*3)]
       this.createStructure()
    }
    
    createStructure(){
        var container = document.querySelector("main")

        var title = document.createElement("h2")
        title.textContent = "Juego del Semáforo"
        container.appendChild(title)

        
        var i = 0
        while (i < this.lights){
            let div = document.createElement("div")
            container.appendChild(div)
            i++
        }
        
        
        var buttonStart = document.createElement("button")
        buttonStart.textContent = "Arranque"
        buttonStart.onclick= () => {
            this.initSequence(buttonStart)
        }
        container.appendChild(buttonStart)

        var buttonEnd = document.createElement("button")
        buttonEnd.textContent = "Reacción"
        buttonEnd.disabled = true
        buttonEnd.onclick = () => {
            this.stopReaction(buttonEnd)
        }
        container.appendChild(buttonEnd)
        
    }

    initSequence(buttonUsed){
       buttonUsed.onclick = null
       let divs = document.querySelectorAll("main div")
       const loadDelay = this.difficulty*100
       const totalLoadTime = loadDelay + 2000

        let i = 1
        for (let div of divs){
            div.classList.remove("unload")
            this.wait((i)*loadDelay, () => div.classList.add("load"))
            i++
        }
            
            this.endSequence(divs, totalLoadTime)
    }

    endSequence(divs, totalLoadTime){
        this.wait(totalLoadTime+this.difficulty*100, 
            () =>  
            { 
                divs.forEach(((item,i) => 
                {
                  item.classList.remove("load")
                  item.classList.add("unload")
                }))

                document.querySelector("main button:last-of-type")
                .disabled = false

                this.unload_moment = Date.now()
            }
        )
    }

    wait(ms, callback){
        setTimeout(callback, ms)
    }

    stopReaction(buttonUsed){
        this.click_moment = Date.now()
        let difference = (this.click_moment - this.unload_moment)

        let isArticle = document.querySelector("main article")
        if (isArticle == null) {
            let article = document.createElement("article")
            document.querySelector("main").appendChild(article)
        }
        let isPAded = document.querySelector("main article h3")
        if (isPAded != null){
            isPAded.textContent = difference + "ms"
        } else {
            let timeShown = document.createElement("h3")
            timeShown.textContent = difference +"ms"
            document.querySelector("main article").appendChild(timeShown)
        }
        

        buttonUsed.disabled = true
        
        this.createRecordForm()

        let startButton = document.querySelector("main button:first-of-type")
        startButton.onclick = () => this.initSequence(startButton)
    }

    createRecordForm(){
        let isAside = document.querySelector("main aside")
        if (isAside == null){
            isAside = document.createElement("aside")
            let h3 = document.createElement("h3")
            h3.textContent = "Formularios para Guardar Resultados"
            isAside.appendChild(h3)
            document.querySelector("main").appendChild(isAside)
        }
        let aside = document.querySelector("main aside")
        let form = document.createElement("form")
        form.action='#' 
        form.method='POST'
        let labelName = document.createElement("label")
        labelName.textContent = "Nombre: "
        let inputName = document.createElement("input")
        inputName.type = "text"
        inputName.name="nombre"
        labelName.append(inputName)
        form.append(labelName)
        
        let labelSurname = document.createElement("label");
        labelSurname.textContent = "Apellidos: ";
        let inputSurname = document.createElement("input");
        inputSurname.type = "text";
        inputSurname.name = "apellidos"
        labelSurname.append(inputSurname);
        form.append(labelSurname);
        
        let labelDifficulty = document.createElement("label");
        labelDifficulty.textContent = "Dificultad Jugada: ";
        let inputDifficulty = document.createElement("input");
        inputDifficulty.type = "text";
        inputDifficulty.name = "nivel"
        inputDifficulty.value = this.difficulty;
        inputDifficulty.readOnly = true
        labelDifficulty.append(inputDifficulty);
        form.append(labelDifficulty);

        let labelReactionTime = document.createElement("label");
        labelReactionTime.textContent = "Tiempo de Reacción (ms): ";
        let inputReactionTime = document.createElement("input");
        inputReactionTime.type = "text"; 
        inputReactionTime.name = "tiempo"
        inputReactionTime.readOnly = true
        inputReactionTime.value = this.click_moment - this.unload_moment;
        labelReactionTime.append(inputReactionTime);
        form.append(labelReactionTime);

        let inputSubmit = document.createElement("input");
        inputSubmit.type = "submit";
        inputSubmit.value = "Guardar datos"
        form.append(inputSubmit);

        aside.append(form)

    }
}