class Puzzle {

    "use strict:"
    constructor(){
        this.rows = 3
        this.columns = 3
        this.puzzleBoard = {width: 0, height: 0, pieceOriginalImageWidth: 0, pieceOriginalImageHeight: 0, pieceWidth: 0, pieceHight: 0}
        this.canvas
        this.context

        this.pieceImgs = []
        this.pieceIds = []
        this.pieceIdsRandomized = []
        
        //Web Storage API
        this.storageKey = "resultsRecorded"
    }

    loadResultsRecorded(){
        const data = localStorage.getItem(this.storageKey)
        return data ? JSON.parse(data) : []
    }

    refreshLeaderBoard(){
        this.results.sort((a,b) => a.time-b.time)
        let tbody = document.querySelector("main table tbody")
        tbody.innerHTML = ''
        this.results.forEach((result) => this.appendNewRowToTable(result))
    }
    appendNewRowToTable(result){
        let row = document.createElement("tr")
        let col1 = document.createElement("td")
        col1.headers="nombreJugador"
        col1.textContent = result.name
        let col2 = document.createElement("td")
        col2.headers="fecha"
        col2.textContent = result.date
        let col3 = document.createElement("td")
        col3.headers="tiempoPartida"
        col3.textContent = result.time
        row.append(col1)
        row.append(col2)
        row.append(col3)
        
        this.leaderBoard.append(row)
    }

    addResult(gameTime){
        let input = document.querySelector("main label input")
        let dateRec = new Date()
        dateRec.setTime(Date.now())
        const dateOfGame = dateRec.getDay()+"/"+dateRec.getMonth()+"/"+dateRec.getFullYear()+" "+dateRec.getHours()+":"+dateRec.getMinutes()+":"+dateRec.getSeconds() 
        const playerName = input.value.trim() === "" ? "userSinNombre("+dateOfGame+")" : input.value.trim()
        
        let newGameResult = {
            name: playerName,
            date: dateOfGame,
            time: gameTime
        }

        this.results.push(newGameResult)
        this.saveResults()
        this.appendNewRowToTable(newGameResult)
    }

    saveResults(){
        localStorage.setItem(this.storageKey, JSON.stringify(this.results))
    }

    loadAudio(){
        if (this.audioContext == null){
            this.audioContext = new AudioContext()
            let timeAudio = new Audio()
            timeAudio.src = "./multimedia/audios/clockTickTockPzzle.mp3"
            timeAudio.loop = true

            this.timerTrack = this.audioContext.createMediaElementSource(timeAudio)
            this.timerTrack.connect(this.audioContext.destination)
            this.timerTrack.audio = timeAudio

            let moveAudio = new Audio()
            moveAudio.src = "./multimedia/audios/movimientoPiezaPuzzle.mp3"
            let gainVol = this.audioContext.createGain()
            gainVol.gain.value = 0.5

            this.moveTrack = this.audioContext.createMediaElementSource(moveAudio)
            this.moveTrack.connect(gainVol).connect(this.audioContext.destination)
            this.moveTrack.audio = moveAudio
        }
        
    }

    initGame() {
        //Web Storage API
        this.results = this.loadResultsRecorded()
        this.leaderBoard = document.querySelector("main table tbody")
        this.refreshLeaderBoard()
        let input = document.querySelector("main label input")
       

        let btn = document.querySelector("main button")
        btn.textContent = "Volver a empezar"
        btn.onclick= this.startAgain.bind(this)

        //API Web Audio
        this.loadAudio()
        this.audioContext.resume()

        //API Canvas
        this.canvas = document.querySelector("section canvas")
        this.canvas.willReadFrequently = true;
        this.context = this.canvas.getContext("2d")

        //la logica del juego para mouse
        this.canvas.addEventListener('click', this.mouseClickEvent.bind(this))
        this.canvas.addEventListener('touchstart', this.touchClickEvent.bind(this))


        var img = new Image()
        img.onload = this.spliceImages.bind(img, this)
        img.src = "./multimedia/imagenes/f1puzzle.jpg"

    }

    mouseClickEvent(e) {
        e.preventDefault()
        let mouseCoords = this.getMouseCoords(e.clientX, e.clientY)
        this.canvasEvent(mouseCoords)
    }

    touchClickEvent(e) {
        e.preventDefault()
        let touch = e.touches[0]
        let mouseCoords = this.getMouseCoords(touch.clientX, touch.clientY)
        this.canvasEvent(mouseCoords)
    }

    canvasEvent(mouseCoords) {
       /* e.preventDefault()
        let mouseCoords = this.getMouseCoords(e.clientX, e.clientY)*/
        //recover the piece position (clicked)
        let pieceRow = mouseCoords.x
        let pieceCol = mouseCoords.y

        //revover the blanck piece position
        let blankPiece = this.getImageIndexed(this.pieceIds[this.findBlankIndex()])
        let blankRow = blankPiece.x
        let blankCol = blankPiece.y
        if (!this.isBlankNeighbour(pieceRow,pieceCol,blankRow,blankCol))
            return

        //Web Audio api
        this.moveTrack.audio.play()

        //store image that will be swapped
        const swappedImage = 
            this.context.getImageData(
                            pieceCol*this.puzzleBoard.pieceWidth, 
                            pieceRow*this.puzzleBoard.pieceHight,
                            this.puzzleBoard.pieceWidth,
                            this.puzzleBoard.pieceHight
                        ) //this method returns the pixels section of the bitImage inside the canvas that is accesed
        this.context.fillRect(
                pieceCol*this.puzzleBoard.pieceWidth, 
                pieceRow*this.puzzleBoard.pieceHight,
                this.puzzleBoard.pieceWidth,
                this.puzzleBoard.pieceHight
            )
        this.context.putImageData(
                swappedImage, 
                blankCol*this.puzzleBoard.pieceWidth, 
                blankRow*this.puzzleBoard.pieceHight
            )
        const imgSelected = this.getImageFromCoords(pieceRow,pieceCol)
        const imgBlank = this.getImageFromCoords(blankRow,blankCol)

        this.swapIndex(imgSelected, imgBlank)

        if (this.isFinished()){
            this.canvas.removeEventListener('click', mouseClickEvent)
            this.drawBlankPiece()
            this.stopTimer()
            this.addResult(this.finalTime)
        }
    }

    getMousePos(e){
        return {
            x: e.clientX,
            y: e.clientY
        }
    }

    spliceImages(puzzle){
        puzzle.puzzleBoard.width = puzzle.canvas.width
        puzzle.puzzleBoard.height = puzzle.canvas.height
        puzzle.puzzleBoard.pieceOriginalImageWidth = Math.floor(this.naturalWidth/puzzle.rows)
        puzzle.puzzleBoard.pieceOriginalImageHeight = Math.floor(this.naturalHeight/puzzle.columns)
        puzzle.puzzleBoard.pieceWidth = Math.floor(puzzle.puzzleBoard.width/puzzle.rows)
        puzzle.puzzleBoard.pieceHight = Math.floor(puzzle.puzzleBoard.height/puzzle.columns)

        //create a temporal canvas 
        let tempCanvas = document.createElement("canvas")
        tempCanvas.width = puzzle.puzzleBoard.width
        tempCanvas.height = puzzle.puzzleBoard.height
        let tempContext = tempCanvas.getContext("2d")

        for(let i = 0 ; i < puzzle.rows ; i++){
            for (let j = 0 ; j < puzzle.columns ; j++){
                tempContext.drawImage(
                    this,
                    i*puzzle.puzzleBoard.pieceOriginalImageWidth,
                    j*puzzle.puzzleBoard.pieceOriginalImageHeight,
                    puzzle.puzzleBoard.pieceOriginalImageWidth,
                    puzzle.puzzleBoard.pieceOriginalImageHeight,
                    0,0, tempCanvas.width, tempCanvas.height
                )
                    
                puzzle.pieceImgs.push(tempCanvas.toDataURL())

                let imgId = i+j*(puzzle.columns)
                puzzle.pieceIds.push(imgId)
            }
        }

        puzzle.shuffleImages()
        puzzle.drawImages()
        puzzle.startTimer()
    }

    shuffleImages(){
        this.pieceIdsRandomized= [...this.pieceIds]
        this.pieceIdsRandomized.sort( () => Math.random() -0.5)

        for (let i = 0 ; i < this.pieceIdsRandomized.length ; i++){
            if (this.pieceIdsRandomized[i]==this.pieceIds[i]){
                this.shuffleImages()
                return
            } else {
                let theOneLeftBlank = Math.round(Math.random()*(this.rows*this.columns -1))
                this.pieceIdsRandomized[theOneLeftBlank] = -1
                return
            }
        }
    }

    drawImages(){
        for (let i = 0 ; i < this.pieceIdsRandomized.length ; i++){
            if (this.pieceIdsRandomized[i] == -1) continue;
            let coord = this.getImageIndexed(i)     
            let x = coord.x
            let y = coord.y
            let imgURL = this.pieceImgs[this.pieceIdsRandomized[i]]
            let imgHTML = new Image()
            this.context.attrPuzzleBoard = this.puzzleBoard
            imgHTML.attrContext = this.context
            imgHTML.onload = function () {
                this.attrContext.drawImage(
                    this, 0,0,
                    this.width,this.height, 
                    x*this.attrContext.attrPuzzleBoard.pieceWidth, y*this.attrContext.attrPuzzleBoard.pieceHight,
                    this.attrContext.attrPuzzleBoard.pieceWidth, this.attrContext.attrPuzzleBoard.pieceHight
                )
            }
            imgHTML.src = imgURL
        }
    }

    getImageIndexed(index){
        let row = Math.floor(index/this.columns)
        let col = index % this.rows
        return {x:row, y:col}
    }

    getMouseCoords(x,y){
        const rect = this.canvas.getBoundingClientRect(); 
        const scaleX = this.canvas.width / rect.width;   
        const scaleY = this.canvas.height / rect.height; 
        const mouseX = (x - rect.left) * scaleX;
        const mouseY = (y - rect.top) * scaleY;

        const col = Math.floor(mouseX / this.puzzleBoard.pieceWidth);
        const row = Math.floor(mouseY / this.puzzleBoard.pieceHight);

        return { x: row, y: col };
    }

    findBlankIndex(){
        for(let i = 0 ; i < this.pieceIdsRandomized.length ; i++)
            if (this.pieceIdsRandomized[i] == -1) return i
    }

    isBlankNeighbour(pieceRow, pieceCol, blankRow, blankCol){
        if(pieceRow!=blankRow && pieceCol!=blankCol) return false
        if(Math.abs(pieceRow-blankRow)==1 || Math.abs(pieceCol-blankCol)==1) return true
        return false
    }

    getImageFromCoords(x,y){
        return x+y*this.columns
    }

    swapIndex(img, blank){
        this.pieceIdsRandomized[blank] = this.pieceIdsRandomized[img]
        this.pieceIdsRandomized[img] = -1
    }

    isFinished(){
        for(let i = 0 ; i < this.pieceIdsRandomized.length ; i++){
            if(this.pieceIdsRandomized[i]==-1)continue
            if(this.pieceIdsRandomized[i]!=i) return false
        }
        return true
    }

    drawBlankPiece(){
        let blank = this.findBlankIndex()
        let positionToDraw = this.getImageIndexed(blank)

        var row = positionToDraw.x
        var col = positionToDraw.y

        let imgToDraw = new Image()
        imgToDraw.attrContext = this.context
        imgToDraw.onload = function () {
            this.attrContext.drawImage(
                this,
                row*this.attrContext.attrPuzzleBoard.pieceWidth,
                col*this.attrContext.attrPuzzleBoard.pieceHight,
                this.attrContext.attrPuzzleBoard.pieceWidth,
                this.attrContext.attrPuzzleBoard.pieceHight,
            )
        }
        imgToDraw.src= this.pieceImgs[this.pieceIds[blank]]

    }

    startAgain(){
        this.audioContext.suspend()
        this.stopTimer()

        let input = document.querySelector("main label input")

        let btn = document.querySelector("main button")
        btn.textContent = "Comenzar Juego"
        btn.onclick = this.initGame.bind(this)

        this.context.clearRect(0,0, this.canvas.width, this.canvas.height)
        this.canvas.width = this.canvas.width

        this.pieceIds = []
        this.pieceIdsRandomized = []
        this.pieceImgs = []

        clearInterval(this.timerInterval)
        const label = document.querySelector("main label:nth-of-type(2)")
        label.textContent = "Tiempo: 0:00"

    }

    startTimer(){
        //Web Audio API
        this.timerTrack.audio.play()

        this.timeStart = Date.now()
        const timeShown = document.querySelector("main label:nth-of-type(2)")
        this.timerInterval = setInterval(() => {
            let elapsedTime = this.computeTime()
            let seconds = Math.floor((elapsedTime/1000)%60)
            let minutes = Math.floor((elapsedTime/1000)/60)
            timeShown.textContent="Tiempo: "+minutes+":"+(seconds<10?"0":"")+seconds
        },1000)
    }
    computeTime(){
        return Date.now() - this.timeStart
    }

    stopTimer(){
        this.finalTime = this.computeTime()
        clearInterval(this.timerInterval)
        //Web Audio API
        this.timerTrack.audio.pause()
        this.timerTrack.audio.currentTime = 0
    }
 }

const app = new Puzzle()