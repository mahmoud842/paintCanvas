import Shape from './Shape'

class Triangle extends Shape {
    constructor() {
        super();
        this.v1x = 0
        this.v1y = 0
        this.v2x = 0
        this.v2y = 0
        this.v3x = 0
        this.v3y = 0
    }
    
    updatePosition(x, y) {
        if (x == null && y == null){
            // calculate the 3 vertices positions based on start and end
            let upLeftx = Math.min(this.startx, this.endx)
            let upLefty = Math.min(this.starty, this.endy)
            let botRightx = Math.max(this.startx, this.endx)
            let botRighty = Math.max(this.starty, this.endy)
            this.v1x = upLeftx
            this.v1y = botRighty
            this.v3x = botRightx
            this.v3y = botRighty
            this.v2x = Math.floor((upLeftx + botRightx) / 2)
            this.v2y = upLefty
            this.centerx = Math.floor((this.startx + this.endx) / 2)
            this.centery = Math.floor((this.starty + this.endy) / 2)
        }
    }

    draw(canva) {
        canva.beginPath();
        canva.moveTo(this.v1x, this.v1y);
        canva.lineTo(this.v2x, this.v2y);
        canva.lineTo(this.v3x, this.v3y);
        canva.fillStyle = this.backcolor;
        canva.fill()
        canva.closePath();
        canva.strokeStyle = this.color;
        canva.lineWidth = this.thickness;
        canva.stroke();
    }
    
    clone() {
        const copy = new this.constructor(); // this.constructor ensures the correct class type

        // Copy all properties
        copy.startx = this.startx;
        copy.starty = this.starty;
        copy.endx = this.endx;
        copy.endy = this.endy;
        copy.v1x = this.v1x
        copy.v1y = this.v1y
        copy.v2x = this.v2x
        copy.v2y = this.v2y
        copy.v3x = this.v3x
        copy.v3y = this.v3y
        copy.color = this.color;
        copy.thickness = this.thickness;
        copy.centerx = this.centerx;
        copy.centery = this.centery;

        return copy;
    }

    organize() {
        return
    }
}

export default Triangle;