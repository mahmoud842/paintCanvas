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
        this.updateSize();
        this.updatePosition();
        console.log("end: " + this.x + " " + this.y + " " + this.width + " " + this.height + " " + this.thickness + " " + this.color);
    }

    updateSize() {
        // Adjust size based on the start and end points
        this.width = Math.abs(this.endx - this.startx);
        this.height = Math.abs(this.endy - this.starty);
    }

    updatePosition() {
        // Adjust position based on start point (starting from the bottom-left corner)
        this.x = this.startx;
        this.y = this.starty - this.height; // Adjust y to make start point the bottom-left corner
    }
    clone() {
        // Create a new instance of the current class
        const copy = new this.constructor(); // this.constructor ensures the correct class type

        // Copy all properties
        copy.startx = this.startx;
        copy.starty = this.starty;
        copy.endx = this.endx;
        copy.endy = this.endy;
        copy.x = this.x;
        copy.y = this.y;
        copy.width = this.width;
        copy.height = this.height;
        copy.color = this.color;
        copy.thickness = this.thickness;

        return copy;
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
        // console.log("draw: " + this.x + " " + this.y + " " + this.width + " " + this.height + " " + this.thickness + " " + this.color);
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
