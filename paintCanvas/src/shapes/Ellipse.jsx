import Shape from './Shape'

class Ellipse extends Shape{
    constructor() {
        super();
        this.rx = 0;
        this.ry = 0;
        this.rotation = 0;
        // if you want to make half circle/Ellipse
        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;
        this.anticlockwise = true;
    }
    
    updatePosition(x, y) {
        if (x == null && y == null){
            let upLeftx = Math.min(this.startx, this.endx)
            let upLefty = Math.min(this.starty, this.endy)
            let botRightx = Math.max(this.startx, this.endx)
            let botRighty = Math.max(this.starty, this.endy)
            this.centerx = Math.floor((this.startx + this.endx) / 2)
            this.centery = Math.floor((this.starty + this.endy) / 2)
            this.rx = Math.floor(Math.abs(upLeftx - botRightx) / 2)
            this.ry = Math.floor(Math.abs(upLefty - botRighty) / 2)
        }
    }

    draw(canva) {
        canva.beginPath();
        canva.ellipse(this.centerx, this.centery, this.rx, this.ry, this.rotation, this.startAngle, this.endAngle);
        canva.lineWidth = this.thickness;
        canva.strokeStyle = this.color;
        canva.fillStyle = this.backcolor;
        canva.fill();
        canva.stroke();
    }

    organize() {
        throw new Error("The organize method must be implemented in a subclass");
    }
}

export default Ellipse;