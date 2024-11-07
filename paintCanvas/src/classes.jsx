class Shape {
    constructor() {
        this.startx = 0;
        this.starty = 0;
        this.endx = 1;
        this.endy = 1;
        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
        this.color = 'black';
        this.thickness = 4;
        console.log("create: " + this.x + " " + this.y + " " + this.width + " " + this.height + " " + this.thickness + " " + this.color);
    }

    clear(canva) {
        canva.clearRect(this.x, this.y, this.width, this.height);
    }

    setColor(color) {
        this.color = color;
    }

    setThick(thickness) {
        this.thickness = thickness;
    }
    draw(canva) {
        throw new Error("The draw method must be implemented in a subclass");
    }
    setEndPoint(x, y) {
        this.endx = x;
        this.endy = y;
        this.x = this.startx;
        this.y = this.starty;
        this.width = this.endx - this.startx;
        this.height = this.endy - this.starty;
        console.log("end: " + this.x + " " + this.y + " " + this.width + " " + this.height + " " + this.thickness + " " + this.color);
    }
}

class Rectangle extends Shape {
    constructor() {
        super(); 
    }

    setStartPoint(x, y) {
        this.startx = x;
        this.starty = y;
    }

    draw(canva) {
        console.log("draw: " + this.x + " " + this.y + " " + this.width + " " + this.height + " " + this.thickness + " " + this.color);
        canva.strokeStyle = this.color;
        canva.lineWidth = this.thickness;
        canva.strokeRect(this.x, this.y, this.width, this.height);
    }
    updateSize() {
        // Example: Can update the width/height as needed
        this.width = this.endx - this.startx;
        this.height = this.endy - this.starty;
    }

    updatePosition() {
        this.x = this.startx;
        this.y = this.starty;
    }
}
class Polygon extends Shape{

}
class Elipse extends Shape{

}
class Line extends Shape{

}
class Triangle extends Polygon{

}
class ShapeFactory {
    createShape(name) {
        if (name === "rectangle") {
            return new Rectangle();
        }
    }
}

export default ShapeFactory;
