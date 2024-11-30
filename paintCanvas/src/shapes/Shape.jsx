class Shape {
    constructor() {
        // start and end are only used when drawing the shape for the first time
        this.start = null
        this.end = null
        this.center = [0, 0]
        this.color = '#000000'
        this.backgroundColor = 'transparent'
        this.thickness = 4
        this.focused = false
        this.editMode = -1 // each shape will have his own editable modes but 0 is move for all of them
    }

    getEnd() {return this.end}

    clear(canva) {
        canva.clearRect(this.x, this.y, this.width, this.height);
    }

    setColor(color) {
        this.color = color;
    }

    setThickness(thickness) {
        this.thickness = Math.max(1, thickness);
    }

    setBackgroundColor(color){       
        this.backgroundColor = color;
    }

    getColor() {
        return this.color
    }

    getThickness() {
        return this.thickness
    }

    getBackgroundColor(){       
        return this.backgroundColor
    }

    getCenter(){
        return this.center
    }
    
    draw(canva) {
        throw new Error("The draw method must be implemented in a subclass");
    }

    setStartPoint(x, y) {
        this.start = [x, y]
    }

    setEndPoint(x, y) {
        this.end = [x, y]
        this.updateShape()
    }

    updateShape() {
        throw new Error("The updateShape method must be implemented")
    }

    move(dx,dy){
        throw new Error("The move method must be implemented")
    }

    isSelected(x,y){
        throw new Error("The isSelected method must be implemented")
    }

    focus(){
        this.focused = true
    }

    unfocus(){
        this.focused = false
    }

    drawIndicatorCircle(canva, center, radius){
        if (radius == null)
            radius = Math.max(this.thickness, 4)
        canva.beginPath()
        canva.arc(center[0], center[1], radius, 0, 2 * Math.PI)
        canva.fillStyle = 'white'
        canva.fill()
        canva.strokeStyle = 'blue'
        canva.lineWidth = 2
        canva.stroke()
    }

    CheckInsideIndicatorCircle(center, point){
        // Calculate the squared distance between the point and the circle's center
        const distanceSquared = (point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2;
        const radiusSquared = Math.max(this.thickness, 4) ** 2;

        // Check if the point is inside the circle
        return distanceSquared <= radiusSquared;
    }

    rotatePoint(point, degree) {
        let rad = degree * (Math.PI / 180)
        // Step 1: Translate point to origin
        let translatedX = point[0] - this.center[0];
        let translatedY = point[1] - this.center[1];
    
        // Step 2: Apply rotation
        let rotatedX = translatedX * Math.cos(rad) - translatedY * Math.sin(rad);
        let rotatedY = translatedX * Math.sin(rad) + translatedY * Math.cos(rad);
    
        // Step 3: Translate back to the original position
        let newX = rotatedX + this.center[0];
        let newY = rotatedY + this.center[1];
    
        return [newX, newY];
    }

    angleBetweenVectors(p1, p2) {
        let x1 = p1[0]
        let x2 = p2[0]
        let y1 = p1[1]
        let y2 = p2[1]
        // Step 1: Compute the dot product
        let dotProduct = x1 * x2 + y1 * y2;
    
        // Step 2: Compute the magnitudes
        let magnitude1 = Math.sqrt(x1 ** 2 + y1 ** 2);
        let magnitude2 = Math.sqrt(x2 ** 2 + y2 ** 2);
    
        // Step 3: Compute the cosine of the angle
        let cosTheta = dotProduct / (magnitude1 * magnitude2);
    
        // Step 4: Compute the angle in radians
        let angleRadians = Math.acos(cosTheta);
    
        // Step 5: Determine the sign of the angle using the cross product
        let crossProduct = x1 * y2 - y1 * x2;
    
        let angleWithSign = angleRadians;
        if (crossProduct < 0) {
            // If cross product is negative, angle is negative (clockwise)
            angleWithSign = -angleWithSign;
        }
    
        // Return the angle in radians and its sign (positive or negative)
        return angleWithSign * (180 / Math.PI)
    }

    getVector(p2, p1) {
        let vx = p2[0] - p1[0]; // x-component of the vector
        let vy = p2[1] - p1[1]; // y-component of the vector
        return [vx, vy];
    }

    getProperties(){
        return {
            color : this.color,
            backgroundColor : this.backgroundColor,
            thickness : this.thickness
        }
    }
    
}
export default Shape;