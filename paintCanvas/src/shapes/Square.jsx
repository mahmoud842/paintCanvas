import Rectangle from './Rectangle'

class Square extends Rectangle {
    updateShape() {
        this.borderPoint = [[0, 0], [0, 0], [0, 0], [0, 0]]
        let sideLength = Math.min(Math.abs(this.end[0] - this.start[0]), Math.abs(this.end[1] - this.start[1]))
        this.width = sideLength
        this.height = sideLength

        if (this.start[0] < this.end[0]){
            this.borderPoint[0][0] = this.start[0]
            this.borderPoint[3][0] = this.start[0]
            this.borderPoint[1][0] = this.start[0] + this.width
            this.borderPoint[2][0] = this.start[0] + this.width
        }
        else {
            this.borderPoint[0][0] = this.start[0] - this.width
            this.borderPoint[3][0] = this.start[0] - this.width
            this.borderPoint[1][0] = this.start[0]
            this.borderPoint[2][0] = this.start[0]
        }

        if (this.start[1] < this.end[1]){
            this.borderPoint[0][1] = this.start[1]
            this.borderPoint[1][1] = this.start[1]
            this.borderPoint[2][1] = this.start[1] + this.height
            this.borderPoint[3][1] = this.start[1] + this.height
        }
        else {
            this.borderPoint[0][1] = this.start[1] - this.height
            this.borderPoint[1][1] = this.start[1] - this.height
            this.borderPoint[2][1] = this.start[1]
            this.borderPoint[3][1] = this.start[1]
        }
        this.center = [(this.borderPoint[0][0] + this.borderPoint[2][0]) / 2, (this.borderPoint[0][1] + this.borderPoint[2][1]) / 2]
        this.pPoint = this.getPerpendicularPoint(this.borderPoint[0], this.borderPoint[1])
    }
}

export default Square;