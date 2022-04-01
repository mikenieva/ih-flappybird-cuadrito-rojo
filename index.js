// index.js

// DESARROLLO DE VIDEOJUEGO
// 1. INSTANCIAMIENTO DEL ÁREA DE JUEGO

const myObstacles = []

const myGameArea = {
    canvas: document.createElement("canvas"),
    frames: 0,
    start: function() {
        this.canvas.width = 500
        this.canvas.height = 270
        this.context = this.canvas.getContext("2d")
        document.body.appendChild(this.canvas)

        // ESTABLECER EL MOTOR
        this.interval = setInterval(updateGameArea, 20)
    },
    clear: function(){
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height)
    },
    stop: function () {
        clearInterval(this.interval)
    },
    score: function() {
        const points = Math.floor(this.frames / 5)

        this.context.font = "18px arial"
        this.context.fillStyle = "black"
        this.context.fillText(`Score: ${points}`, 350, 50)
        

    }
    
}

const updateGameArea = () => {
    console.log("Ejecutando motor...")
    myGameArea.clear()
    player.newPos()
    player.update()
    updateObstacles()
    checkGameOver()
    myGameArea.score()
}

const updateObstacles = () => {

    for(i = 0; i < myObstacles.length; i++){
        myObstacles[i].x += -1
        myObstacles[i].update()
    }


    myGameArea.frames += 1

    // SI LOS FRAMES SÍ SON DIVISIBLES ENTRE 120 Y EL RESIDUO ES CERO...
    if(myGameArea.frames % 120 === 0){
        console.log("Divisible entre 120")
        // NECESITO CREAR OBSTÁCULOS
        let x = myGameArea.canvas.width
        let minHeight = 20
        let maxHeight = 200
        //  20          #         200
        // minHeight < height < maxHeight
        let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight)
        console.log(height)

        let minGap = 50
        let maxGap = 200
        let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap)

        // CREACIÓN DE OBSTÁCULOS
        // PIPA DE ARRIBA
        myObstacles.push(new Component(10, height, "green", x, 0))
        myObstacles.push(new Component(10, x - height - gap, "green", x, height + gap ))
    }
    // SI LOS FRAMES NO SON DIVISIBLES ENTRE 120 (TENER UN RESIDUO DE CERO)

}

// 2. COMPONENTES
class Component {
    constructor(width, height, color, x, y){
        this.width = width
        this.height = height
        this.color = color
        this.x = x
        this.y = y
        // SPEED PROPERTIES
        this.speedX = 0
        this.speedY = 0
    }

    update() {
        const ctx = myGameArea.context
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    newPos() {
        this.x += this.speedX
        this.y += this.speedY        
    }

    left() {
        return this.x
    }

    right(){
        return this.x + this.width
    }

    top(){
        return this.y
    }

    bottom(){
        return this.y + this.height
    }

    // SÍ COLISIONÓ?
    crashWith(obstacle){
        return !(
            this.bottom() < obstacle.top() || 
            this.top() > obstacle.bottom() || 
            this.right() < obstacle.left() || 
            this.left() > obstacle.right()
        )
  }
}


const checkGameOver = () => {
    // CHOCÓ O NO CHOQUÉ?
    const crashed = myObstacles.some((element) => {
        return player.crashWith(element)
    })

    if(crashed){
        myGameArea.stop()
    }

    return

}


    
// EJECUCIONES
myGameArea.start()

const player = new Component(30,30, "red", 0, 110)

// EVENTOS
document.addEventListener("keydown", (e) => {

    switch(e.key) {
        case "ArrowUp":
            player.speedY -= 1
            break
        case "ArrowDown":
            player.speedY += 1
            break
        case "ArrowLeft":
            player.speedX -= 1
            break
        case "ArrowRight":
            player.speedX += 1
            break
        default: 
            break
    }
})

document.addEventListener("keyup", (e) => {
    player.speedX = 0
    player.speedY = 0
})

