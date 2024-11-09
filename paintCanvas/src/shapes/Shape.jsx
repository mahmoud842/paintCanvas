class Shape {
    constructor() {
        this.startx = 0;
        this.starty = 0;
        this.endx = 1;
        this.endy = 1;
        this.color = 'black';
        this.thickness = 4;
        this.centerx = 0;
        this.centery = 0;
    }

    setColor(color) {
        this.color = color;
    }

    setThick(thickness) {
        this.thickness = thickness;
    }
    
    setStartPoint(x, y) {
        this.startx = x;
        this.starty = y;
    }
    
    setEndPoint(x, y) {
        this.endx = x;
        this.endy = y;
        this.updatePosition();
    }
    
    updatePosition(x, y) {
        // adjust position to be upper left corner
        throw new Error("The updatePosistion method must be implemented in a subclass");
    }

    draw(canva) {
        throw new Error("The draw method must be implemented in a subclass");
    }
    
    clone() {
        throw new Error("The clone method must be implemented in a subclass");
    }

    organize() {
        throw new Error("The organize method must be implemented in a subclass");
    }
}

export default Shape; 