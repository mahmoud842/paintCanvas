import Shape from './Shape'

class Ellipse extends Shape{
    constructor() {
        super();
        this.name = "Ellipse"
        this.rx = 0;
        this.ry = 0;
        this.rotation = 0;
        // if you want to make half circle/Ellipse
        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;
        this.anticlockwise = true;
        this.pPoint = [0,0]
    }
    getPerpendicularPoint(point1, point2) {
        let point = [(point1[0] + point2[0]) / 2, point1[1] - (this.thickness/2 + 20)]
        return point
    }

    getCenter() {
        return [this.centerx, this.centery]
    }

    updateShape() {
        this.borderPoint = []
        this.borderPoint.push([Math.min(this.start[0], this.end[0]), Math.min(this.start[1], this.end[1])])
        this.borderPoint.push([Math.max(this.start[0], this.end[0]), Math.min(this.start[1], this.end[1])])
        this.borderPoint.push([Math.max(this.start[0], this.end[0]), Math.max(this.start[1], this.end[1])])
        this.borderPoint.push([Math.min(this.start[0], this.end[0]), Math.max(this.start[1], this.end[1])])
        this.centerx = (this.start[0] + this.end[0]) / 2;
        this.centery = (this.start[1] + this.end[1]) / 2;
        this.rx = Math.abs(this.end[0] - this.start[0]) / 2;
        this.ry = Math.abs(this.end[1] - this.start[1]) / 2;
        this.pPoint = this.getPerpendicularPoint(this.borderPoint[0], this.borderPoint[1])
    }

    draw(canva) {
        canva.beginPath();
        canva.ellipse(this.centerx, this.centery, this.rx, this.ry, this.rotation * Math.PI / 180, this.startAngle, this.endAngle);
        canva.lineWidth = this.thickness;
        canva.strokeStyle = this.color;
        canva.fillStyle = this.backgroundColor
        canva.fill();
        canva.stroke();
        if (this.focused){
            for (let i = 0; i < 4; i++)
                this.drawIndicatorCircle(canva, this.borderPoint[i])
            this.drawIndicatorCircle(canva, this.pPoint)
            canva.beginPath()
            canva.moveTo(this.borderPoint[0][0],this.borderPoint[0][1]); // Bottom-left corner
            canva.lineTo(this.borderPoint[1][0], this.borderPoint[1][1]); // Top-right corner
            canva.lineTo(this.borderPoint[2][0], this.borderPoint[2][1]); // Bottom-right corner
            canva.lineTo(this.borderPoint[3][0], this.borderPoint[3][1]); // Bottom-left corner
            canva.closePath()
            canva.strokeStyle = '#90d5ff'
            canva.lineWidth = 2
            canva.stroke()
        }
    }
    isSelected(x,y) {
        // Rotate the point back by the negative rotation angle
        const [rotatedX, rotatedY] = this.rotatePoint([x,y], -this.rotation)

        // Outer ellipse parameters
        const aOuter = this.rx + this.thickness/2
        const bOuter = this.ry + this.thickness/2

        // Inner ellipse parameters
        const aInner = this.rx - this.thickness/2
        const bInner = this.ry - this.thickness/2

        // Distance checks
        const outerCheck = ((rotatedX - this.centerx) ** 2) / aOuter ** 2 + ((rotatedY - this.centery) ** 2) / bOuter ** 2
        const innerCheck = ((rotatedX - this.centerx) ** 2) / aInner ** 2 + ((rotatedY - this.centery) ** 2) / bInner ** 2

        // Point lies on the thick ellipse if it is between the inner and outer boundaries
        return outerCheck <= 1 && innerCheck >= 1
    }
    edit(x, y){
        for (let i = 0; i < 4; i++){
            if (this.CheckInsideIndicatorCircle(this.borderPoint[i] ,[x, y])){
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
    startEdit(x, y){
        for (let i = 0; i < 4; i++){
            if (this.CheckInsideIndicatorCircle(this.borderPoint[i] ,[x, y])){
                this.editMode = i+1
                return true
            }
        }
        if (this.CheckInsideIndicatorCircle(this.pPoint, [x, y])){
            this.v1 = this.getVector(this.pPoint, [this.centerx,this.centery])
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
    rotateEllipse(degree){
        let rad = degree * (180/Math.PI)
        for (let i = 0; i < 4; i++){
            this.borderPoint[i] = this.rotatePoint(this.borderPoint[i], rad)
        }
       
        this.pPoint = this.rotatePoint(this.pPoint, rad)
       
    }
    updateShapeEditMode(newPoint, i){
        this.borderPoint[(i+1) % 4] = this.perpendicularProjection(this.borderPoint[(i+2) % 4], this.borderPoint[(i+1) % 4], newPoint)
        this.borderPoint[(i+3) % 4] = this.perpendicularProjection(this.borderPoint[(i+2) % 4], this.borderPoint[(i+3) % 4], newPoint)
        this.borderPoint[i] = newPoint
        
        this.centerx = (this.borderPoint[0][0] + this.borderPoint[2][0]) /2
        this.centery = (this.borderPoint[0][1] + this.borderPoint[2][1]) / 2
        this.rotateEllipse(-this.rotation)
        this.rx = Math.abs(this.borderPoint[0][0] - this.borderPoint[2][0])/2
        this.ry = Math.abs(this.borderPoint[0][1] - this.borderPoint[2][1])/2
        this.pPoint = this.getPerpendicularPoint([Math.min(this.borderPoint[0][0], this.borderPoint[2][0]), Math.min(this.borderPoint[0][1], this.borderPoint[2][1])], [Math.max(this.borderPoint[0][0], this.borderPoint[2][0]), Math.max(this.borderPoint[0][1], this.borderPoint[2][1])])
        this.rotateEllipse(this.rotation)
    }
    move(dx, dy){
        for (let i = 0; i < 4; i++){
            this.borderPoint[i][0] += dx
            this.borderPoint[i][1] += dy
        }
        this.pPoint[0] += dx
        this.pPoint[1] += dy
        this.centerx += dx
        this.centery += dy
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
                let v2 = this.getVector([x, y], [this.centerx,this.centery])
                let old_angle = this.newAngle
                this.newAngle = this.angleBetweenVectors(this.v1, v2)
                
                this.newAngle += 360
                this.newAngle %= 360
                
                this.rotation += this.newAngle-old_angle;
                for (let i = 0; i < 4; i++){
                    this.borderPoint[i] =this.rotatePoint(this.borderPoint[i],(this.newAngle-old_angle))
                }
                this.pPoint =this.rotatePoint(this.pPoint,(this.newAngle-old_angle))
            
                
                break
        }
    }
    rotatePoint(point, degree) {
        let rad = degree * (Math.PI / 180)
        // Step 1: Translate point to origin
        let translatedX = point[0] - this.centerx;
        let translatedY = point[1] - this.centery;
        
        // Step 2: Apply rotation
        let rotatedX = translatedX * Math.cos(rad) - translatedY * Math.sin(rad);
        let rotatedY = translatedX * Math.sin(rad) + translatedY * Math.cos(rad);
        // Step 3: Translate back to the original position
        let newX = rotatedX + this.centerx;
        let newY = rotatedY + this.centery;
    
        return [newX, newY];
    }
    isPointInside(P) {
        // Extract coordinates of rectangle corners and the point
        //this.rotateRectangle(-this.angle)
        const [x1, y1] = this.borderPoint[0]; // Point A (first corner)
        const [x2, y2] = this.borderPoint[2]; // Point C (opposite corner)
        const [px, py] = this.rotatePoint(P, -this.startAngle); // Point P (point to check)
        
        
    
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        
        // Check if point P is inside the bounds
        return px >= minX && px <= maxX && py >= minY && py <= maxY;
    }
    endEditing(){
        this.editMode = -1
    }

    clone(){
        const copy = new this.constructor();
        copy.start = [...this.start]
        copy.end = [...this.end]
        copy.color = this.color
        copy.backgroundColor = this.backgroundColor
        copy.thickness = this.thickness
        copy.focused = false
        copy.editMode = -1
        copy.name = this.name

        copy.borderPoint = JSON.parse(JSON.stringify(this.borderPoint))
        copy.centerx = this.centerx
        copy.centery = this.centery
        copy.rx = this.rx
        copy.ry = this.ry
        copy.startaAngle = this.startaAngle
        copy.rotation = this.rotation
        copy.pPoint = [...this.pPoint]
        return copy
    }

    giveData(data){
        this.start = data.start.map(Number)
        this.end = data.end.map(Number)
        this.color = data.color
        this.backgroundColor = data.backgroundColor
        this.thickness = Number(data.thickness)
        this.focused = false
        this.editMode = -1
        this.name = data.name
        
        this.borderPoint = data.borderPoint
        this.centerx = Number(data.centerx)
        this.centery = Number(data.centery)
        this.rx = Number(data.rx)
        this.ry = Number(data.ry)
        this.startaAngle = Number(data.startaAngle)
        this.rotation = Number(data.rotation)
        this.pPoint = data.pPoint.map(Number)
    }
}

export default Ellipse;