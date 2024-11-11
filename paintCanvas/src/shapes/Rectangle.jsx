import Shape from './Shape'

class Rectangle extends Shape {
    
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
    }

    draw(canva) {
        canva.strokeStyle = this.color;
        canva.lineWidth = this.thickness;
        canva.fillStyle = this.backcolor;                        //230
        canva.fillRect(this.x, this.y, this.width, this.height)  //230
        canva.strokeRect(this.x, this.y, this.width, this.height);
    }

    updatePosition(x, y) {
        if (x == null && y == null){
            this.x = Math.min(this.startx, this.endx)
            this.y = Math.min(this.starty, this.endy)
            this.width = Math.abs(this.endx - this.startx)
            this.height = Math.abs(this.endy - this.starty)
            return
        }

        // dragging from center
        let shiftx = x - this.centerx
        let shifty = y - this.centery
        this.x += shiftx
        this.y += shifty
        this.centerx += shiftx
        this.centery += shifty
        this.startx += shiftx
        this.starty += shifty
        this.endx += shiftx
        this.endy += shifty
    }

    organize(){
        this.startx = this.x;
        this.starty = this.y;
        this.endx = this.x + this.width;
        this.endy = this.y + this.height;
        this.centerx = this.x + Math.floor(this.width / 2)
        this.centery = this.y + Math.floor(this.width / 2)
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
        copy.centerx = this.centerx;
        copy.centery = this.centery;

        return copy;
    }
    _isBetween(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }

    // Method to check if a point (x, y) is within the rectangle
    isSelected(x, y) {
        
        if (this.thickness >= Math.abs(this.starty-y) && this._isBetween(x, this.startx, this.endx )) {
            return true;
        }
        if (this.thickness >= Math.abs(this.endy-y) && this._isBetween(x, this.endx, this.startx )) {
            return true;
        }
        if (this.thickness >= Math.abs(this.startx-x) && this._isBetween(y, this.starty, this.endy)) {
            return true;
        }
        if (this.thickness >= Math.abs(this.endx-x) && this._isBetween(y, this.endy, this.starty )) {
            return true;
        }
        return false;
    }
}

export default Rectangle;