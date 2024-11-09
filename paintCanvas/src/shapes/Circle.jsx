import Ellipse from "./Ellipse"

class Circle extends Ellipse {
    updatePosition(x, y) {
        if (x == null && y == null){
            let upLeftx = Math.min(this.startx, this.endx)
            let upLefty = Math.min(this.starty, this.endy)
            let botRightx = Math.max(this.startx, this.endx)
            let botRighty = Math.max(this.starty, this.endy)
            this.centerx = Math.floor((this.startx + this.endx) / 2)
            this.centery = Math.floor((this.starty + this.endy) / 2)
            let radius = Math.min(Math.floor(Math.abs(upLeftx - botRightx) / 2), Math.floor(Math.abs(upLefty - botRighty) / 2))
            this.rx = radius
            this.ry = radius
        }
    }
}

export default Circle;