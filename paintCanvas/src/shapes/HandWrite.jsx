import Shape from './Shape'

class HandWrite extends Shape{
    constructor() {
        super()
        this.name = "HandWrite"
        this.points = []
        this.maxima = [0,0]
        this.minima = [999999, 999999]
        this.border1 = [0, 0]
        this.border2 = [0,0]
        this.pPoint = [0,0]
        this.angle = 0
    }

    draw(canva){
        canva.beginPath()
        canva.moveTo(this.points[0][0], this.points[0][1])
        for (let i = 1; i < this.points.length; i++){
            canva.lineTo(this.points[i][0], this.points[i][1])
        }
        canva.lineWidth = this.thickness
        canva.strokeStyle = this.color
        canva.stroke()

        if (this.focused){
            canva.beginPath()
            canva.moveTo(this.minima[0], this.minima[1])
            canva.lineTo(this.border1[0], this.border1[1])
            canva.lineTo(this.maxima[0], this.maxima[1])
            canva.lineTo(this.border2[0], this.border2[1])
            canva.closePath()
            canva.strokeStyle = '#90d5ff'
            canva.lineWidth = 2
            canva.stroke()
            this.drawIndicatorCircle(canva, this.pPoint)
        }
    }

    getPerpendicularPoint(point1, point2) {
        let point = [(point1[0] + point2[0]) / 2, point1[1] - (this.thickness/2 + 10)]
        return point
    }

    updateShape(){
        if (this.points.length == 0){
            this.maxima[0] = Math.max(this.maxima[0], this.start[0])
            this.maxima[1] = Math.max(this.maxima[1], this.start[1])
            this.minima[0] = Math.min(this.minima[0], this.start[0])
            this.minima[1] = Math.min(this.minima[1], this.start[1])
            this.points.push(this.start)
            this.center = [this.start[0], this.start[1]]
            return
        }
        this.maxima[0] = Math.max(this.maxima[0], this.end[0])
        this.maxima[1] = Math.max(this.maxima[1], this.end[1])
        this.minima[0] = Math.min(this.minima[0], this.end[0])
        this.minima[1] = Math.min(this.minima[1], this.end[1])

        this.border1 = [this.maxima[0], this.minima[1]]
        this.border2 = [this.minima[0], this.maxima[1]]

        this.center[0] *= this.points.length
        this.center[1] *= this.points.length
        this.center[0] += this.end[0]
        this.center[1] += this.end[1]
        this.points.push(this.end)
        this.center[0] /= this.points.length
        this.center[1] /= this.points.length
        this.pPoint = this.getPerpendicularPoint(this.minima, this.maxima)
    }

    isSelected(px, py) {
        const T = this.thickness / 2;
    
        for (let i = 0; i < this.points.length - 1; i++) {
            const [x1, y1] = this.points[i];
            const [x2, y2] = this.points[i + 1];
    
            // Vector from A to B
            const ABx = x2 - x1;
            const ABy = y2 - y1;
    
            // Vector from A to P
            const APx = px - x1;
            const APy = py - y1;
    
            // Projection scalar of AP onto AB
            const AB_length_squared = ABx * ABx + ABy * ABy;
            const dotProduct = APx * ABx + APy * ABy;
            const t = Math.max(0, Math.min(1, dotProduct / AB_length_squared));
    
            // Closest point on the segment
            const closestX = x1 + t * ABx;
            const closestY = y1 + t * ABy;
    
            // Distance from P to the closest point
            const dx = px - closestX;
            const dy = py - closestY;
            const distanceSquared = dx * dx + dy * dy;
    
            if (distanceSquared <= T * T) {
                return true; // Point is on the thick line
            }
        }
    
        return false; // Point is not on the line
    }

    isPointInside(p) {
        // Extract coordinates of rectangle corners and the point
        this.rotateDraw(-this.angle)
        const [x1, y1] = this.minima // Point A (first corner)
        const [x2, y2] = this.maxima // Point C (opposite corner)
        const [px, py] = this.rotatePoint(p, -this.angle) // Point P (point to check)
        this.rotateDraw(this.angle)

        // Calculate the min and max bounds of the rectangle
        const minX = Math.min(x1, x2)
        const maxX = Math.max(x1, x2)
        const minY = Math.min(y1, y2)
        const maxY = Math.max(y1, y2)
    
        // Check if point P is inside the bounds
        return px >= minX && px <= maxX && py >= minY && py <= maxY
    }

    edit(x, y){
        if (this.CheckInsideIndicatorCircle(this.pPoint, [x, y]) || this.isPointInside([x, y]))
            return true
        else return false
    }

    startEdit(x, y){
        if (this.CheckInsideIndicatorCircle(this.pPoint, [x, y])){
            this.editMode = 1
            this.v1 = this.getVector(this.pPoint, this.center)
            this.newAngle = 0
        }
        else if (this.isPointInside([x, y])){
            this.startEditPoint = [x, y]
            this.editMode = 0
        }
        else return false
        return true
    }

    move(dx, dy){
        for (let i = 0; i < this.points.length; i++){
            this.points[i][0] += dx
            this.points[i][1] += dy
        }
        this.center[0] += dx
        this.center[1] += dy
        this.pPoint[0] += dx
        this.pPoint[1] += dy
        this.maxima[0] += dx
        this.maxima[1] += dy
        this.minima[0] += dx
        this.minima[1] += dy
        this.border1[0] += dx
        this.border1[1] += dy
        this.border2[0] += dx
        this.border2[1] += dy
    }

    rotateDraw(angle){
        for (let i = 0; i < this.points.length; i++){
            this.points[i] = this.rotatePoint(this.points[i], angle)
        }
        this.pPoint = this.rotatePoint(this.pPoint, angle)
        this.maxima = this.rotatePoint(this.maxima, angle)
        this.minima = this.rotatePoint(this.minima, angle)
        this.border1 = this.rotatePoint(this.border1, angle)
        this.border2 = this.rotatePoint(this.border2, angle)
    }

    setEndEditPoint(x, y){
        switch(this.editMode){
            case 0:
                this.move((x - this.startEditPoint[0]), (y - this.startEditPoint[1]))
                this.startEditPoint = [x, y]
                break
            case 1:
                let v2 = this.getVector([x, y], this.center)
                this.rotateDraw(-this.newAngle)
                this.angle -= this.newAngle
                this.newAngle = this.angleBetweenVectors(this.v1, v2)
                this.newAngle += 360
                this.newAngle %= 360
                this.rotateDraw(this.newAngle)
                this.angle = (this.angle + this.newAngle) % 360
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

        copy.name = this.name
        copy.points = JSON.parse(JSON.stringify(this.points))
        copy.borderPoint = JSON.parse(JSON.stringify(this.borderPoint))
        copy.maxima = [...this.maxima]
        copy.minima = [...this.minima]
        copy.border1 = [...this.border1]
        copy.border2 = [...this.border2]
        copy.pPoint = [...this.pPoint]
        copy.angle = this.angle
        return copy
    }

    giveData(data){
        this.start = data.start.map(Number)
        this.end = data.end.map(Number)
        this.center = data.center.map(Number)
        this.color = data.color
        this.backgroundColor = data.backgroundColor
        this.thickness = Number(data.thickness)
        this.focused = false
        this.editMode = -1
        this.borderPoint = data.borderPoint

        this.name = data.name
        if (Array.isArray(data.points[0]))
            this.points = data.points.map(innerArray => innerArray.map(Number))
        else {
            let tmpArr = []
            for (let j = 0; j < data.points.length-1; j+=2){
                tmpArr.push([Number(data.points[j]), Number(data.points[j+1])])
            }
            this.points = tmpArr
        }
        
        this.maxima = data.maxima.map(Number)
        this.minima = data.minima.map(Number)
        this.border1 = data.border1.map(Number)
        this.border2 = data.border2.map(Number)
        this.pPoint = data.pPoint.map(Number)
        this.angle = Number(data.angle)
    }
}

export default HandWrite;