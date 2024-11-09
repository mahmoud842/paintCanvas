import Rectangle from './Rectangle'
import Square from './Square'
import Line from './LineSegment'
import Triangle from './Triangle'
import Ellipse from './Ellipse'
import Circle from './Circle'

class ShapeFactory {
    createShape(name) {
        switch (name) {
            case "rectangle":
                return new Rectangle()
            case "square":
                return new Square()
            case "line":
                return new Line()
            case "triangle":
                return new Triangle()
            case "ellipse":
                return new Ellipse()
            case "circle":
                return new Circle()
            default:
                throw new Error("undefined shape selected");
        }
    }
}

export default ShapeFactory;
