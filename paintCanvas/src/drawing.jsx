import ShapeFactory from './shapes/shapeFactory'

class Drawing {

    constructor(){
        this.selectMode = false
        this.isEditing = false
        this.drawingMode = false
        this.isDrawing = false
        
        this.shapeFactory = new ShapeFactory()
        this.shapes = []
        this.shapesCopy = [[]]
        this.index = 0
        this.selectedShape = null
        this.element = null
        this.selectedShapeIdx = -1

        // default values
        this.drawingProperties = {
            color : 'black',
            BackgroundColor : 'transparent',
            thickness : 4
        }
    }

    updateShapeProperties(properties){
        if (this.selectedShape == null)
            throw new Error("how do you want to update properties without selecting????");
        this.selectedShape.setColor(properties.color)
        this.selectedShape.setThickness(properties.thickness)
        this.selectedShape.setBackgroundColor(properties.BackgroundColor)
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

    getShapesCopyUndo(){
        if(this.index < this.shapesCopy.length-1 && this.index > -1){
            this.index+=1
            return this.shapesCopy[this.shapesCopy.length-1-this.index]
        }else if(this.index == this.shapesCopy.length-1)
            return this.shapesCopy[0]
        else{
            this.index+=1
            return this.shapesCopy[this.shapesCopy.length-1]
        }
    }
    getShapesCopyRedo(){
        if(this.index > 1){
            this.index-=1
            return this.shapesCopy[this.shapesCopy.length-1-this.index]
        }else{
            this.index-=1
            return this.shapesCopy[this.shapesCopy.length-1]
        }
        
    }

    selectDrawingShape(type){
        this.lastShapeType = type
        this.selectedShape = this.shapeFactory.createShape(type)
        this.selectedShape.setColor(this.drawingProperties.color)
        this.selectedShape.setBackgroundColor(this.drawingProperties.BackgroundColor)
        this.selectedShape.setThickness(this.drawingProperties.thickness)
    }

    checkSelection(x, y){
        for (let i = 0; i < this.shapes.length; i++) {
            if (this.shapes[i].isSelected(x, y)) {
                this.selectedShapeIdx = i
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
            this.cloneShapes()
        }
        else if (this.isDrawing){
            if (this.selectedShape.getEnd() == null)
                this.shapes.pop()
            this.isDrawing = false
            this.selectDrawingShape(this.lastShapeType)
            this.cloneShapes()
        }
    }
    
    cloneShapes(){
        let arr = []
        if(this.selectedShapeIdx === -1){
            console.log(this.selectedShapeIdx)
            for(let i=0 ; i<this.shapes.length ; i++){
                arr.push(this.shapes[i].clone())
            }
            this.shapesCopy.push(arr)
            
        }else{
            for(let i=0 ; i < this.shapesCopy[this.shapesCopy.length-1].length ; i++){
                arr.push(this.shapesCopy[this.shapesCopy.length-1][i].clone())
            }
            arr.push(this.shapes[this.selectedShapeIdx].clone())
            this.shapesCopy.push(arr)
            
        }
    }


    setSelectedColor(color){
        if (this.selectedShape != null){
            this.selectedShape.setColor(color)
            this.cloneShapes()
        }
        if (!this.selectMode)
            this.drawingProperties.color = color
    }
    setSelectedBackgroundColor(color){
        if (this.selectedShape != null){
            this.selectedShape.setBackgroundColor(color)
            this.cloneShapes()
        }
            
        if (!this.selectMode)
            this.drawingProperties.BackgroundColor = color
    }
    setSelectedThickness(thickness){
        if (this.selectedShape != null){
            this.selectedShape.setThickness(thickness)
            this.cloneShapes()
        }
        if (!this.selectMode)
            this.drawingProperties.thickness = thickness
    }

    deleteShape(){
        if (!this.selectMode || this.selectedShapeIdx == -1)
            return
        this.shapes.splice(this.selectedShapeIdx, 1)
        this.selectedShape = null
    }

}

export default Drawing;