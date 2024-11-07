class Rectangle {
    constructor(){
        this.startx = 0
        this.starty = 0
        this.endx = 1
        this.endy = 1
        this.x = 0
        this.y = 0
        this.width = 1
        this.height = 1
        this.color = 'black'
        this.thickness = 4
        console.log("create: " + this.x + " " + this.y + " " + this.width + " " + this.height + " " + this.thickness + " " + this.color)
    }

    setStartPoint(x, y){
        this.startx = x
        this.starty = y
    }

    setEndPoint(x, y){
        this.endx = x
        this.endy = y
        this.x = this.startx
        this.y = this.starty
        this.width = this.endx - this.startx
        this.height = this.endy - this.starty
        console.log(this.endy + " " + this.starty)
        console.log("end: " + this.x + " " + this.y + " " + this.width + " " + this.height + " " + this.thickness + " " + this.color)
    }

    draw(canva){
        console.log("draw: " + this.x + " " + this.y + " " + this.width + " " + this.height + " " + this.thickness + " " + this.color)
        canva.strokeStyle = this.color
        canva.lineWidth = this.thickness
        canva.strokeRect(this.x, this.y, this.width, this.height)
    }

    clear(canva){
        canva.clearRect(0, 0, this.width, this.height)
    }

    setColor(canva){

    }

    setThick(canva){

    }

    updateSize(canva){

    }

    updatePostion(canva){

    }
}

class ShapeFactory {
    createShape(name){
        if (name === "rectangle")
            return new Rectangle();
    }
}

export default ShapeFactory;