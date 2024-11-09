import Rectangle from './Rectangle'

class Square extends Rectangle {

    updatePosition(x, y) {
        if (x == null && y == null){
            let sideLength = Math.min(Math.abs(this.endx - this.startx), Math.abs(this.endy - this.starty))
            this.width = sideLength
            this.height = sideLength
            if (this.startx < this.endx)
                this.x = this.startx
            else 
                this.x = this.startx - this.width

            if (this.starty < this.endy)
                this.y = this.starty
            else
                this.y = this.starty - this.width
                
            return
        }

        // dragging from center
        let shiftx = Math.abs(x - this.centerx)
        let shifty = Math.abs(y - this.centery)
        this.x += shiftx
        this.y += shifty
        this.centerx += shiftx
        this.centery += shifty
        this.startx += shiftx
        this.starty += shifty
        this.endx += shiftx
        this.endy += shifty
    }
}

export default Square;