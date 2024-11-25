import ShapeFactory from './shapes/shapeFactory'

class Drawing {

    constructor(){
        this.selectMode = false
        this.isEditing = false
        this.drawingMode = false
        this.isDrawing = false
        
        this.shapeFactory = new ShapeFactory()
        this.shapes = []
        this.selectedShape = null

    }
    
    setDrawingMode(){
        this.drawingMode = true
        this.selectMode = false
        if (this.selectedShape != null)
            this.selectedShape.unfocus()
        this.selectedShape = null
    }

    setSelectMode(x){
        this.drawingMode = false
        this.selectMode = true
        if (this.selectedShape != null)
            this.selectedShape.unfocus()
        this.selectedShape = null
    }
    
    getShapes(){
        return this.shapes
    }

    selectDrawingShape(type){
        this.selectedShape = this.shapeFactory.createShape(type)
    }

    checkSelection(x, y){
        for (let i = 0; i < this.shapes.length; i++) {
            if (this.shapes[i].isSelected(x, y)) {
                return this.shapes[i];
            }
        }
        return null;
    }

    mouseDown(x, y){
        if (this.selectMode){
            if (this.selectedShape != null){
                if (this.selectedShape.edit(x, y)){
                    this.isEditing = true
                    return;
                }
                else {
                    this.selectedShape.unfocus()
                    this.selectedShape = null
                }
            }
            let newSelectedShape = this.checkSelection(x, y)
            if (newSelectedShape != null){
                this.selectedShape = newSelectedShape
                this.selectedShape.focus()
            }
        }
        else if (this.drawingMode && this.selectedShape != null){
            this.shapes.push(this.selectedShape)
            this.selectedShape.setStartPoint(x, y)
            this.isDrawing = true
        }
    }

    mouseMove(x, y){
        if (this.isEditing){
            this.selectedShape.setEndEditPoint(x, y)
        }
        else if (this.isDrawing){
            this.selectedShape.setEndPoint(x, y)
        }
    }
    
    mouseUp(x, y){
        if (this.isEditing){
            this.isEditing = false
            this.selectedShape.endEditing()
        }
        else if (this.isDrawing){
            this.isDrawing = false
            this.setSelectMode()
        }
    }

}

export default Drawing;