import Shape from './Shape'

class Triangle extends Shape {
    constructor() {
        super();
        this.name = "Triangle"
        this.v1 = [0, 0]
        this.v2 = [0, 0]
        this.v3 = [0, 0]
    }
    
    setCenter(){
        this.center[0] = (this.v1[0] + this.v2[0] + this.v3[0]) / 3
        this.center[1] = (this.v1[1] + this.v2[1] + this.v3[1]) / 3
    }

    updateShape() {
        // calculate the 3 vertices positions based on start and end
        let upLeftx = Math.min(this.start[0], this.end[0])
        let upLefty = Math.min(this.start[1], this.end[1])
        let botRightx = Math.max(this.start[0], this.end[0])
        let botRighty = Math.max(this.start[1], this.end[1])
        this.v1 = [upLeftx, botRighty]
        this.v3 = [botRightx, botRighty]
        this.v2 = [Math.floor((upLeftx + botRightx) / 2), upLefty]
        this.setCenter()
    }

    draw(canva) {
        canva.beginPath();
        canva.moveTo(this.v1[0], this.v1[1]);
        canva.lineTo(this.v2[0], this.v2[1]);
        canva.lineTo(this.v3[0], this.v3[1]);
        canva.fillStyle = this.backgroundColor;
        canva.fill()
        canva.closePath();
        canva.strokeStyle = this.color;
        canva.lineWidth = this.thickness;
        canva.stroke();

        if (this.focused){
            this.drawIndicatorCircle(canva, this.v1)
            this.drawIndicatorCircle(canva, this.v2)
            this.drawIndicatorCircle(canva, this.v3)
        }
    }

    isSelected(px, py) {
        const [x1, y1] = this.v1
        const [x2, y2] = this.v2
        const [x3, y3] = this.v3

        // Helper to calculate the perpendicular distance from a point to a line segment
        function pointToLineDistance(px, py, x1, y1, x2, y2) {
            const lengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;
            if (lengthSquared === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2); // Line segment is a point
            const t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lengthSquared));
            const projX = x1 + t * (x2 - x1);
            const projY = y1 + t * (y2 - y1);
            return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
        }

        // Check if the point is near each side
        const d1 = pointToLineDistance(px, py, x1, y1, x2, y2);
        const d2 = pointToLineDistance(px, py, x2, y2, x3, y3);
        const d3 = pointToLineDistance(px, py, x3, y3, x1, y1);

        return d1 <= this.thickness || d2 <= this.thickness || d3 <= this.thickness;
    }

    isPointInside(p) {
        const [x, y] = p
        const [x1, y1] = this.v1
        const [x2, y2] = this.v2
        const [x3, y3] = this.v3

        // Helper function to calculate the area of a triangle given its vertices
        function triangleArea(x1, y1, x2, y2, x3, y3) {
            return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
        }

        // Calculate the area of the triangle ABC
        const areaABC = triangleArea(x1, y1, x2, y2, x3, y3);

        // Calculate the area of the triangle PAB
        const areaPAB = triangleArea(x, y, x1, y1, x2, y2);

        // Calculate the area of the triangle PBC
        const areaPBC = triangleArea(x, y, x2, y2, x3, y3);

        // Calculate the area of the triangle PCA
        const areaPCA = triangleArea(x, y, x3, y3, x1, y1);

        // Check if the sum of the smaller triangles equals the main triangle's area
        return Math.abs(areaABC - (areaPAB + areaPBC + areaPCA)) < 1e-10;
    }

    edit(x, y){
        if ((this.CheckInsideIndicatorCircle(this.v1, [x, y]))
        || (this.CheckInsideIndicatorCircle(this.v2, [x, y]))
        || (this.CheckInsideIndicatorCircle(this.v3, [x, y]))
        || (this.isPointInside([x, y])))
            return true
        else return false
    }

    startEdit(x, y){
        if (this.CheckInsideIndicatorCircle(this.v1, [x, y]))
            this.editMode = 1
        else if (this.CheckInsideIndicatorCircle(this.v2, [x, y]))
            this.editMode = 2
        else if (this.CheckInsideIndicatorCircle(this.v3, [x, y]))
            this.editMode = 3
        else if (this.isPointInside([x, y])){
            this.startEditPoint = [x, y]
            this.editMode = 0
        }
        else return false
        return true
    }

    setEndEditPoint(x, y){
        switch(this.editMode){
            case 0:
                this.move((x - this.startEditPoint[0]), (y - this.startEditPoint[1]))
                this.startEditPoint = [x, y]
                break

            case 1:
                this.v1 = [x, y]
                this.setCenter()
                break
            case 2:
                this.v2 = [x, y]
                this.setCenter()
                break
            case 3:
                this.v3 = [x, y]
                this.setCenter()
                break
        }
        this.setCenter()
    }

    move(dx, dy){
        this.v1[0] += dx
        this.v1[1] += dy
        this.v2[0] += dx
        this.v2[1] += dy
        this.v3[0] += dx
        this.v3[1] += dy
        this.setCenter()
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
        copy.v1 = [...this.v1]
        copy.v2 = [...this.v2]
        copy.v3 = [...this.v3]
        return copy
    }

    giveData(data){
        this.start = data.start
        this.end = data.end
        this.center = data.center
        this.color = data.color
        this.backgroundColor = data.backgroundColor
        this.thickness = data.thickness
        this.focused = false
        this.editMode = -1
        this.name = data.name
    
        this.name = data.name
        this.v1 = data.v1
        this.v2 = data.v2
        this.v3 = data.v3
    }
}

export default Triangle;