
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

        this.shuffleElements()
        this.createElements()
        this.addEventListeners()
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
        let isPre = document.querySelector("main aside").querySelectorAll("pre")[0]
        if (isPre != undefined){
            if (isPre.hidden)
                isPre.hidden = false
            else 
                isPre.hidden = true
        } else {
            let pre = document.createElement("pre")
            pre.textContent = 
                "INSTRUCCIONES: Juego de memorización\n"+
                "\t¿Cuál es el objetivo del juego?\n"+
                "\t\tConseguir que todas las cartas de la baraja de memorización queden boca arriba.\n"+
                "\t\tLas cartas quedan boca arriba cuando muestran el equipo de F1 al que representan.\n\n"+
                "\t¿Cómo jugar?\n"+
                "\t\tPulsa cualquiera de las cartas para que esta se de la vuelta y muestre el equipo de F1 representado.\n"+
                "\t\tUna vez hayas pulsado 2 cartas de la baraja pueden pasar dos cosas:\n"+
                "\t\t\t1. Las cartas son iguales\n"+
                "\t\t\t\tSi las cartas son iguales estas se quedaran dadas la vuelta.\n"+
                "\t\t\t2. Las cartas NO son iguales\n"+
                "\t\t\t\tSi las cartas no son iguales estas trás un lapso de 2 segundos se volverán a su posición original\n"+
                "\t\t\tRepite el proceso hasta que todas las cartas estén boca arriba"
            
            document.querySelector("main aside").appendChild(pre)
        }
   }

}

