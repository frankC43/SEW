
class Memoria {

    "use strict:"
   constructor(){
        this.elements = [
            {
                element: "RedBull",
                source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg",
                
            }, 
            {
                element: "McLaren",
                source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg",
                
            },
            {
                element: "Alpine",
                source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg",
                
            },
            {
                element: "AstonMartin",
                source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg",
                
            },
            {
                element: "Ferrari",
                source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg",
                
            },
            {
                element: "Mercedes",
                source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg",
                
            }
        ]

        this.hasFlippedCard = false
        this.lockBoard = false
        this.firstCard = null
        this.secondCard = null
        this.elements = this.elements.concat(this.elements)

        this.isFinished = false

        this.shuffleElements()
        this.createElements()
        this.addEventListeners()
        this.getTutorial()
   }

   shuffleElements(){
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
   }

   unflipCards(memoria){
        memoria.lockBoard = true
        setTimeout( () => 
        {
            document.querySelector("main section")
                    .querySelectorAll("article[data-state='flip']")
                    .forEach((child)=>child.removeAttribute('data-state'))
            
            memoria.resetBoard()
        }, 1500)
        
   }

   resetBoard(){
        this.firstCard = null
        this.secondCard = null
        this.lockBoard = false
        this.hasFlippedCard = false
   }

   checkForMatch(memoria){
        if (memoria.firstCard.dataset.element == memoria.secondCard.dataset.element) 
            memoria.disableCards(memoria)
        else 
            memoria.unflipCards(memoria)
        memoria.checkGameFinished(memoria)
   }

   checkGameFinished(memoria){
       memoria.isFinished = true
       document.querySelector("body main section")
            .querySelectorAll("article[data-element]")
            .forEach((card) => {
            if (card.dataset.state !== "revealed"){
                memoria.isFinished = false
            }
        })
        if (memoria.isFinished){
            let isMsg = document.querySelector("body main > h3")
            if (isMsg == undefined){
                let msg = document.createElement("h3")
                msg.textContent = "FIN DEL JUEGO"

                let aside = document.querySelector("body main aside")
                let section = document.querySelector("body main section")
                aside.parentNode.insertBefore(msg, section)
            } else {
                if (memoria.isFinished){
                    msg.hidden = true
                }
                else {
                    msg.hidden = false
                }
            }
        } 
   }

   disableCards(memoria){
        document.querySelector("body main section")
            .querySelectorAll("article[data-state='flip']")
            .forEach((child)=>child.setAttribute("data-state", "revealed"))

        memoria.resetBoard()
   }

   createElements(){
        var cardsContainer = document.querySelector("body main section")
        
        this.elements.forEach((item) => {
            let card = document.createElement("article")
            card.setAttribute("data-element", item.element)
            card.setAttribute("data-state","hide")

            let title = document.createElement("h3")
            title.textContent = "Tarjeta de Memoria"

            let img = document.createElement("img")
            img.src = item.source
            img.alt = item.element
            img.classList.add("hidden")

            card.appendChild(title)
            card.appendChild(img)

            cardsContainer.appendChild(card)
        })
   }

   flipCard(memoria){
        if (memoria.lockBoard) return
        if(this.dataset.state == 'revealed') return
        if(this == memoria.firstCard) return

        this.dataset.state = 'flip'
        if (!memoria.hasFlippedCard){
            memoria.hasFlippedCard = true
            memoria.firstCard = this
        }
        else {
            memoria.lockBoard = true
            memoria.secondCard = this
            memoria.checkForMatch(memoria)
        }


   }

   addEventListeners(){
      document.querySelector("body main section").querySelectorAll("article")
        .forEach((card) => 
            { 
                card.addEventListener('click', 
                    
                        this.flipCard.bind(card, this)
                    )
            })
   }

   getTutorial(){
        let areInsructions = document.querySelector("main aside article")
        if (areInsructions != undefined){
            areInsructions.style.display = areInsructions.style.display === "none" ? "flex" : "none";
            let btn = document.querySelector("main aside button")
            btn.textContent = areInsructions.style.display === "none" ? "Ver más instrucciones" : "Ocultar instrucciones"
        } else {
            let instArticle = document.createElement("article")
            let inst = document.createElement("h2")
            inst.textContent = "Instrucciones del Juego de Memoria"
            instArticle.append(inst)

            let objectivo = document.createElement("h4")
            objectivo.textContent = "Objetivo del Juego"
            instArticle.append(objectivo)

            let p1 = document.createElement("p")
            p1.textContent = "Consigue que todas las Tarjetas de Memorización queden dadas la vuelta."
            instArticle.append(p1)

            let reglas = document.createElement("h4")
            reglas.textContent = "Reglas del Juego"
            instArticle.append(reglas)

            let p2 = document.createElement("p")
            p2.textContent = "Las Tarjetas de Memoria se deben pulsar para que se den la vuelta. Pulsa máximo 2 Tarjetas de memoria seguidas."
            instArticle.append(p2)

            let h5 = document.createElement("p")
            h5.textContent = "Una vez pulsadas dos Tarjetas de Memoria pueden suceder dos cosas:"
            instArticle.append(h5)

            let ol = document.createElement("ol")
            let li1 = document.createElement("li")
            li1.textContent="Las cartas son iguales"
            ol.append(li1)

            let pli1 = document.createElement("p")
            pli1.textContent = "Si las cartas son iguales estas se quedarán dadas la vuelta mostrando la imagen previamente oculta"
            ol.append(pli1)

            let li2 = document.createElement("li")
            li2.textContent = "Las cartas NO son iguales"
            ol.append(li2)

            let pli2 = document.createElement("p")
            pli2.textContent = "Si NO son iguales, las cartas volverán a darse la vuelta despues de unos segundos, ocultando de nuevo su imagen. Repite de nuevo el intento."
            ol.append(pli2)
            instArticle.append(ol)

            let hasGanado = document.createElement("h4")
            hasGanado.textContent = "¿Cuando gano el juego de memoria?"
            instArticle.append(hasGanado)

            let p3 = document.createElement("p")
            p3.textContent = "El Juego de Memoria se termina cuando todas las cartas queden mostrando la imagen que ocultan"
            instArticle.append(p3)
            
            document.querySelector("main aside").append(instArticle)
        }
   }

}

