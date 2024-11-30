import Shape from './shapes/Shape'
import ShapeFactory from './shapes/shapeFactory'
import Message from './Message'
class Drawing {

    constructor(){
        this.selectMode = false
        this.isEditing = false
        this.drawingMode = false
        this.isDrawing = false
        
        this.shapeFactory = new ShapeFactory()
        this.shapesUndoStack = []
        this.shapesRedoStack = []
        this.shapes = []
        this.selectedShape = null
        this.selectedShapeIdx = -1

        // variables for copy & paste
        this.shapeClone = null

        // default values
        this.drawingProperties = {
            color : '#000000',
            BackgroundColor : 'transparent',
            thickness : 4
        }
    }

    isSelected(){
        if (this.selectedShape == null)
            return false
        return true
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

    pushUndo(arr){
        this.shapesUndoStack.push(arr)
    }

    pushRedo(arr){
        this.shapesRedoStack.push(arr)
    }

    clearRedo(){
        this.shapesRedoStack.length = 0
    }

    undo(){
        if (this.shapesUndoStack.length > 0){
            this.pushRedo(this.cloneShapes())
            this.shapes = this.shapesUndoStack[this.shapesUndoStack.length - 1]
            this.shapesUndoStack.pop()
        }
    }

    redo(){
        if (this.shapesRedoStack.length > 0){
            this.pushUndo(this.cloneShapes())
            this.shapes = this.shapesRedoStack[this.shapesRedoStack.length - 1]
            this.shapesRedoStack.pop()
        }
    }

    addShapesToUndo(){
        this.pushUndo(this.cloneShapes())
        this.clearRedo()
    }

    cloneShapes(){
        let shapesCopy = []
        for (let i = 0; i < this.shapes.length; i++){
            shapesCopy.push(this.shapes[i].clone())
        }
        return shapesCopy
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
                    this.addShapesToUndo()
                    this.selectedShape.startEdit(x, y)
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
            this.addShapesToUndo()
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
            if (this.selectedShape.getEnd() == null)
                this.shapes.pop()
            this.isDrawing = false
            this.selectDrawingShape(this.lastShapeType)
        }
    }

    setSelectedColor(color){
        if (this.selectedShape != null){
            this.selectedShape.setColor(color)
        }
        if (!this.selectMode)
            this.drawingProperties.color = color
    }
    setSelectedBackgroundColor(color){
        if (this.selectedShape != null){
            this.selectedShape.setBackgroundColor(color)
        }
        if (!this.selectMode)
            this.drawingProperties.BackgroundColor = color
    }

    setSelectedThickness(thickness){
        if (this.selectedShape != null){
            this.addShapesToUndo()
            this.selectedShape.setThickness(thickness)
        }
        if (!this.selectMode)
            this.drawingProperties.thickness = thickness
    }

    deleteShape(){
        if (!this.selectMode || this.selectedShapeIdx == -1)
            return
        this.addShapesToUndo()
        this.shapes.splice(this.selectedShapeIdx, 1)
        this.selectedShape = null
    }

    getSelectedShapeProperties(){
        if (this.selectedShape == null)
            return null
        return {
            color: this.selectedShape.getColor(),
            backgroundColor: this.selectedShape.getBackgroundColor(),
            thickness: this.selectedShape.getThickness()
        }
    }

    copyCommand(position){
        if (this.selectedShape == null || this.selectedShapeIdx == -1)
            return
        this.cloneShape = this.selectedShape.clone()
    }

    pastCommand([x,y]){
        if (this.cloneShape == null || this.selectedShapeIdx == -1)
            return
        this.addShapesToUndo()
        let newShape = this.cloneShape.clone()
        newShape.move(x-this.cloneShape.getCenter()[0], y-this.cloneShape.getCenter()[1])
        this.shapes.push(newShape)
    }

    cutCommand(){
        if (this.selectedShape == null || this.selectedShapeIdx == -1)
            return
        this.cloneShape = this.selectedShape.clone()
        this.deleteShape()
    }
    async save() {
        const newMssg = new Message("tester name", this.shapes);
        const url = 'http://localhost:8080/drawings/json';
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newMssg.name,
                    shapes: newMssg.shapes
                }),
            });    
            if (response.ok) {
                const result = await response.json();
                console.log('Message sent successfully:', result);
            } else {
                console.error('Error sending message:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }
    
    
}

export default Drawing;