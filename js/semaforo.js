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
        var mainContainer = document.querySelector("main")
        var container = document.createElement("section")

        var title = document.createElement("h2")
        title.textContent = "Juego de Reacción"
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
        
        mainContainer.appendChild(container)
    }

    initSequence(buttonUsed){
       buttonUsed.onclick = null
       let divs = document.querySelectorAll("main section div")
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

                document.querySelector("main section button:last-of-type")
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

        let isPAded = document.querySelector("main aside p")
        if (isPAded != null){
            isPAded.textContent = difference + "ms"
        } else {
            let timeShown = document.createElement("p")
            timeShown.textContent = difference +"ms"
            document.querySelector("main aside").appendChild(timeShown)
        }
        

        buttonUsed.disabled = true
        let startButton = document.querySelector("main section button:first-of-type")
        startButton.onclick = () => this.initSequence(startButton)
    }
}