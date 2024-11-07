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
        this.updateSize();
        console.log("end: " + this.x + " " + this.y + " " + this.width + " " + this.height + " " + this.thickness + " " + this.color);
    }

    updateSize() {
        this.width = this.endx - this.startx;
        this.height = this.endy - this.starty;
    }

    updatePosition() {
        this.x = this.startx;
        this.y = this.starty;
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
        console.log("draw Rectangle: " + this.x + " " + this.y + " " + this.width + " " + this.height + " " + this.thickness + " " + this.color);
        canva.strokeStyle = this.color;
        canva.lineWidth = this.thickness;
        canva.strokeRect(this.x, this.y, this.width, this.height);
    }
}

class Polygon extends Shape {
    constructor() {
        super();
        this.sides = 3; // Default sides for polygons (e.g., triangle)
        this.vertices = [];
    }

    setStartPoint(x, y) {
        this.startx = x;
        this.starty = y;
        this.vertices = [x, y]; // Starting point of the polygon
    }

    setEndPoint(x, y) {
        super.setEndPoint(x, y); // Update polygon's end point
        this.vertices.push(x, y); // Save the additional vertex (simplified)
    }

    // Override draw method for Polygon (just a placeholder)
    draw(canva) {
        console.log("draw Polygon: " + this.x + " " + this.y);
        // Drawing logic for polygons can go here (depending on number of sides and vertices)
    }
}

class Elipse extends Shape {
    constructor() {
        super();
        this.radiusX = 1;
        this.radiusY = 1;
    }

    // Override setEndPoint for ellipse to update radii
    setEndPoint(x, y) {
        this.endx = x;
        this.endy = y;
        this.radiusX = Math.abs(x - this.startx) / 2;
        this.radiusY = Math.abs(y - this.starty) / 2;
    }

    // Override draw method for Ellipse
    draw(canva) {
        console.log("draw Ellipse: " + this.x + " " + this.y + " " + this.radiusX + " " + this.radiusY);
        canva.beginPath();
        canva.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
        canva.strokeStyle = this.color;
        canva.lineWidth = this.thickness;
        canva.stroke();
    }
}

class Line extends Shape {
    constructor() {
        super();
    }

    // Override draw method for Line
    draw(canva) {
        console.log("draw Line: " + this.x + " " + this.y + " " + this.width + " " + this.height);
        canva.beginPath();
        canva.moveTo(this.x, this.y);
        canva.lineTo(this.endx, this.endy);
        canva.strokeStyle = this.color;
        canva.lineWidth = this.thickness;
        canva.stroke();
    }
}

class Triangle extends Polygon {
    constructor() {
        super();
        this.sides = 3; // Triangles have 3 sides
    }

    // Override draw method for Triangle
    draw(canva) {
        console.log("draw Triangle: " + this.x + " " + this.y);
        // Drawing logic for triangles can go here
    }
}

class ShapeFactory {
    createShape(name) {
        if (name === "rectangle") {
            return new Rectangle();
        }
        if (name === "polygon") {
            return new Polygon();
        }
        if (name === "ellipse") {
            return new Elipse();
        }
        if (name === "line") {
            return new Line();
        }
        if (name === "triangle") {
            return new Triangle();
        }
    }
}

export default ShapeFactory;
