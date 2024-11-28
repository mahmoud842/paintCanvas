import Shape from './Shape'

class Line extends Shape {
    constructor() {
        super()
        this.name = "LineSegment" // will be used for save/load
    }


    draw(canva){
        canva.beginPath();
        canva.moveTo(this.start[0], this.start[1]);
        canva.lineWidth = this.thickness;
        canva.strokeStyle = this.color;
        canva.lineTo(this.end[0], this.end[1]);
        canva.stroke();

        if (this.focused){
            this.drawIndicatorCircle(canva, this.start)
            this.drawIndicatorCircle(canva, this.end)
        }
    }

    updateShape(){}

    isSelected(px, py){
        let x1 = this.start[0]
        let x2 = this.end[0]
        let y1 = this.start[1]
        let y2 = this.end[1]
        // 1. Calculate the perpendicular distance from point (px, py) to the line (x1, y1) to (x2, y2)
        const numerator = Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1);
        const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
        const distance = numerator / denominator;

        // 2. Check if the point is within the line's thickness
        const isCloseEnough = distance <= this.thickness / 2;

        // 3. Check if the point is within the bounds of the line segment
        const isWithinBounds = px >= Math.min(x1, x2) && px <= Math.max(x1, x2) &&
                            py >= Math.min(y1, y2) && py <= Math.max(y1, y2);

        // Return true if both conditions are satisfied
        return isCloseEnough && isWithinBounds;
    }

    edit(x, y){
        if ((this.CheckInsideIndicatorCircle(this.start, [x, y]))
        || (this.CheckInsideIndicatorCircle(this.end, [x, y]))
        || (this.isSelected(x, y)))
        return true
        else return false
    }

    startEdit(x, y){
        if (this.CheckInsideIndicatorCircle(this.start, [x, y]))
            this.editMode = 1 // to edit start point
        else if (this.CheckInsideIndicatorCircle(this.end, [x, y]))
            this.editMode = 2 // to edit end point
        else if (this.isSelected(x, y))
            this.editMode = 0 // to move
        else return false
        this.startEditPoint = [x, y]
        return true
    }

    move(dx, dy){
        this.start[0] += dx
        this.start[1] += dy
        this.end[0] += dx
        this.end[1] += dy
    }

    setEndEditPoint(x, y){
        switch(this.editMode){
            case 0:
                this.move((x - this.startEditPoint[0]), (y - this.startEditPoint[1]))
                this.startEditPoint = [x, y]
                break
            case 1:
                this.start = [x, y]
                break
            case 2:
                this.end = [x, y]
                break
        }
    }

    endEditing(){
        this.editMode = -1
    }

    clone(){
        const copy = new this.constructor();
        copy.start = [...this.start]
        copy.end = [...this.end]
        copy.center = [...this.center]
        copy.color = this.color
        copy.backgroundColor = this.backgroundColor
        copy.thickness = this.thickness
        copy.focused = false
        copy.editMode = -1
        copy.name = this.name
        return copy
    }
}

export default Line;