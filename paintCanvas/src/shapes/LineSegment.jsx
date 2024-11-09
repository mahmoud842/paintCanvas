import Shape from './Shape'

class Line extends Shape {
    draw(canva){
        canva.beginPath();
        canva.moveTo(this.startx, this.starty);
        canva.lineWidth = this.thickness;
        canva.strokeStyle = this.color;
        canva.lineTo(this.endx, this.endy);
        canva.stroke();
    }
    
    updatePosition(x, y) {
        if (x != null && y != null){
            let shiftx = x - this.centerx
            let shifty = y - this.centery
            this.startx += shiftx
            this.starty += shifty
            this.endx += shiftx
            this.endy += shifty
        }
    }
    
    clone() {
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
        copy.centerx = this.centerx;
        copy.centery = this.centery;

        return copy;
    }

    organize() {
        this.centerx = Math.floor((this.startx + this.endx) / 2)
        this.centery = Math.floor((this.starty + this.endy) / 2)
    }
}

export default Line;