import Rectangle from './Rectangle'
import Square from './Square'
import Line from './LineSegment'
import Triangle from './Triangle'
import Ellipse from './Ellipse'
import Circle from './Circle'
import HandWrite from './HandWrite'

class ShapeBuilder {
    createShapes(shapes) {
        let arr = []
        for (let i = 0; i < shapes.length; i++){
            switch (shapes[i].name) {
                case "Rectangle":
                    arr.push(new Rectangle())
                    break
                case "square":
                    arr.push(new Square())
                    break
                case "LineSegment":
                    arr.push(new Line()) 
                    break
                case "Triangle":
                    arr.push(new Triangle())
                    break
                case "Ellipse":
                    arr.push(new Ellipse())
                    break
                case "circle":
                    arr.push(new Circle())
                    break
                case "HandWrite":
                    arr.push(new HandWrite())
                    break
                default:
                    throw new Error("undefined shape selected");
            }
            arr[arr.length-1].giveData(shapes[i])
        }
        return arr
    }
}

export default ShapeBuilder;