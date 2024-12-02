import Shape from './Shape'

class Rectangle extends Shape {
    
    constructor() {
        super()
        this.name = "Rectangle"
        this.center = [0, 0]
        this.width = 1
        this.height = 1
        this.angle = 0
        
        // point for focus
        this.pPoint = [0,0]
    }

    draw(canva) {
        canva.beginPath()
        canva.moveTo(this.borderPoint[0][0], this.borderPoint[0][1])
        for (let i = 1; i < 4; i++){
            canva.lineTo(this.borderPoint[i][0], this.borderPoint[i][1])
        }        
        canva.closePath()
        canva.strokeStyle = this.color
        canva.lineWidth = this.thickness
        canva.fillStyle = this.backgroundColor
        canva.fill();
        canva.stroke();
        
        if (this.focused){
            for (let i = 0; i < 4; i++)
                this.drawIndicatorCircle(canva, this.borderPoint[i])
            this.drawIndicatorCircle(canva, this.pPoint, 4)
        }
    }

    getPerpendicularPoint(point1, point2) {
        let point = [(point1[0] + point2[0]) / 2, point1[1] - (this.thickness/2 + 10)]
        return point
    }

    updateShape() {
        this.borderPoint = []
        this.borderPoint.push([Math.min(this.start[0], this.end[0]), Math.min(this.start[1], this.end[1])])
        this.borderPoint.push([Math.max(this.start[0], this.end[0]), Math.min(this.start[1], this.end[1])])
        this.borderPoint.push([Math.max(this.start[0], this.end[0]), Math.max(this.start[1], this.end[1])])
        this.borderPoint.push([Math.min(this.start[0], this.end[0]), Math.max(this.start[1], this.end[1])])
        this.center = [(this.borderPoint[0][0] + this.borderPoint[2][0]) / 2, (this.borderPoint[0][1] + this.borderPoint[2][1]) / 2]
        this.width = Math.abs(this.borderPoint[0][0] - this.borderPoint[2][0])
        this.height = Math.abs(this.borderPoint[0][1] - this.borderPoint[2][1])
        this.pPoint = this.getPerpendicularPoint(this.borderPoint[0], this.borderPoint[1])
    }

    isSelected(px, py) {
        let cx = (this.borderPoint[0][0] + this.borderPoint[2][0]) / 2
        let cy = (this.borderPoint[0][1] + this.borderPoint[2][1]) / 2

        // Step 1: Translate point to rectangle center
        const dx = px - cx;
        const dy = py - cy;

        // Step 2: Rotate point by the negative angle to align rectangle
        const cosTheta = Math.cos(-this.angle * Math.PI / 180);
        const sinTheta = Math.sin(-this.angle * Math.PI / 180);
        const xPrime = dx * cosTheta - dy * sinTheta;
        const yPrime = dx * sinTheta + dy * cosTheta;

        // Step 3: Calculate outer and inner bounds
        const halfWidthOuter = (this.width + this.thickness) / 2;
        const halfHeightOuter = (this.height + this.thickness) / 2;
        const halfWidthInner = (this.width - this.thickness) / 2;
        const halfHeightInner = (this.height - this.thickness) / 2;

        // Step 4: Check if point is inside the outer rectangle
        const inOuterRectangle =
            Math.abs(xPrime) <= halfWidthOuter && Math.abs(yPrime) <= halfHeightOuter;

        // Step 5: Check if point is outside the inner rectangle
        const outsideInnerRectangle =
            Math.abs(xPrime) > halfWidthInner || Math.abs(yPrime) > halfHeightInner;

        // Step 6: Return true if the point is on the thick edge
        return inOuterRectangle && outsideInnerRectangle;
    }

    isPointInside(P) {
        // Extract coordinates of rectangle corners and the point
        this.rotateRectangle(-this.angle)
        const [x1, y1] = this.borderPoint[0]; // Point A (first corner)
        const [x2, y2] = this.borderPoint[2]; // Point C (opposite corner)
        const [px, py] = this.rotatePoint(P, -this.angle); // Point P (point to check)
        this.rotateRectangle(this.angle)
        
        // Calculate the min and max bounds of the rectangle
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
    
        // Check if point P is inside the bounds
        return px >= minX && px <= maxX && py >= minY && py <= maxY;
    }

    edit(x, y){
        for (let i = 0; i < 4; i++){
            if (this.CheckInsideIndicatorCircle(this.borderPoint[i], [x, y])){
                return true
            }
        }
        if (this.CheckInsideIndicatorCircle(this.pPoint, [x, y])){
            return true
        }
        if (this.isPointInside([x, y])){
            return true
        }
    }

    startEdit(x,y){
        for (let i = 0; i < 4; i++){
            if (this.CheckInsideIndicatorCircle(this.borderPoint[i], [x, y])){
                this.editMode = i+1
                //this.start = this.rotatePoint(this.borderPoint[(i+2) % 4], -this.angle)
                return true
            }
        }
        if (this.CheckInsideIndicatorCircle(this.pPoint, [x, y])){
            this.v1 = this.getVector(this.pPoint, this.center)
            this.editMode = 5
            this.newAngle = 0
            return true
        }
        if (this.isPointInside([x, y])){
            this.startEditPoint = [x, y]
            this.editMode = 0
            return true
        }
    }

    move(dx, dy){
        for (let i = 0; i < 4; i++){
            this.borderPoint[i][0] += dx
            this.borderPoint[i][1] += dy
        }
        this.pPoint[0] += dx
        this.pPoint[1] += dy
        this.center[0] += dx
        this.center[1] += dy
    }

    rotateRectangle(degree){
        let rad = degree * (Math.PI / 180)
        for (let i = 0; i < 4; i++){
            this.borderPoint[i] = this.rotatePoint(this.borderPoint[i], degree)
        }
        this.pPoint = this.rotatePoint(this.pPoint, degree)
    }

    setEndEditPoint(x, y){
        switch(this.editMode){
            case 0:
                this.move((x - this.startEditPoint[0]), (y - this.startEditPoint[1]))
                this.startEditPoint = [x, y]
                break

            case 1:
            case 2:
            case 3:
            case 4:     
                this.updateShapeEditMode([x,y], this.editMode-1)
                break

            case 5:
                let v2 = this.getVector([x, y], this.center)
                this.rotateRectangle(-this.newAngle)
                this.angle -= this.newAngle
                this.newAngle = this.angleBetweenVectors(this.v1, v2)
                this.newAngle += 360
                this.newAngle %= 360
                this.rotateRectangle(this.newAngle)
                this.angle = (this.angle + this.newAngle) % 360
                break
        }
    }

    perpendicularProjection(A, B, P) {
        // Extract coordinates from the input arrays
        const [x1, y1] = A; // Point A
        const [x2, y2] = [B[0] + 0.0000001, B[1] + 0.0000001]; // Point B
        const [x3, y3] = P; // Point P
    
        // Direction vector of the line AB
        const dx = x2 - x1;
        const dy = y2 - y1;
    
        // Vector from point A to P
        const apx = x3 - x1;
        const apy = y3 - y1;
    
        // Dot product and magnitude squared of AB
        const dotProduct = apx * dx + apy * dy;
        const magnitudeSquared = dx * dx + dy * dy;
    
        // Projection scalar
        const t = dotProduct / magnitudeSquared;
    
        // Projection coordinates
        const xProj = x1 + t * dx;
        const yProj = y1 + t * dy;
    
        // Return the projection point as an array
        return [xProj, yProj];
    }
    
    updateShapeEditMode(newPoint, i){
        this.borderPoint[(i+1) % 4] = this.perpendicularProjection(this.borderPoint[(i+2) % 4], this.borderPoint[(i+1) % 4], newPoint)
        this.borderPoint[(i+3) % 4] = this.perpendicularProjection(this.borderPoint[(i+2) % 4], this.borderPoint[(i+3) % 4], newPoint)
        this.borderPoint[i] = newPoint
        this.center = [(this.borderPoint[0][0] + this.borderPoint[2][0]) / 2, (this.borderPoint[0][1] + this.borderPoint[2][1]) / 2]
        this.rotateRectangle(-this.angle)
        this.width = Math.abs(this.borderPoint[0][0] - this.borderPoint[2][0])
        this.height = Math.abs(this.borderPoint[0][1] - this.borderPoint[2][1])
        this.pPoint = this.getPerpendicularPoint([Math.min(this.borderPoint[0][0], this.borderPoint[2][0]), Math.min(this.borderPoint[0][1], this.borderPoint[2][1])], [Math.max(this.borderPoint[0][0], this.borderPoint[2][0]), Math.max(this.borderPoint[0][1], this.borderPoint[2][1])])
        this.rotateRectangle(this.angle)
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

        copy.borderPoint = JSON.parse(JSON.stringify(this.borderPoint))
        copy.center = [...this.center]
        copy.width = this.width
        copy.height = this.height
        copy.angle = this.angle
        copy.pPoint = [...this.pPoint]
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
        this.name = data.name

        this.borderPoint = data.borderPoint
        this.center = data.center.map(Number)
        this.width = Number(data.width)
        this.height = Number(data.height)
        this.angle = Number(data.angle)
        this.pPoint = data.pPoint.map(Number)
    }
}

export default Rectangle;