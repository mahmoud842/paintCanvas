import Shape from './shapes/Shape'
import ShapeFactory from './shapes/shapeFactory'
import Message from './Message'
import SaveAndLoad from './SaveAndLoad'
import ShapeBuilder from './shapes/shapeBuilder'

class Drawing {

    constructor(){
        this.selectMode = false
        this.isEditing = false
        this.drawingMode = false
        this.isDrawing = false
        
        this.shapeFactory = new ShapeFactory()
        this.shapeBuilder = new ShapeBuilder()
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

        this.serverModule = new SaveAndLoad()
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
            return false
        this.addShapesToUndo()
        this.shapes.splice(this.selectedShapeIdx, 1)
        this.selectedShape = null
        return true
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

    clear() {
        this.addShapesToUndo()
        this.selectMode = true
        this.isEditing = false
        this.drawingMode = false
        this.isDrawing = false

        this.shapes = []
        this.selectedShape = null
        this.selectedShapeIdx = -1
    }

    clearAll() {
        this.selectMode = false
        this.isEditing = false
        this.drawingMode = false
        this.isDrawing = false
        
        this.shapesUndoStack = []
        this.shapesRedoStack = []
        this.shapes = []
        this.selectedShape = null
        this.selectedShapeIdx = -1

        this.shapeClone = null

        this.drawingProperties = {
            color : '#000000',
            BackgroundColor : 'transparent',
            thickness : 4
        }
    }

    async save(canvas, flag) {
        console.log(this.shapes)
        if (this.serverModule.save(this.shapes, canvas, flag))
            alert("saved successfully")
        else
            alert("failed to save")
    }

    async load(canvas) {

    }

    async loadDrawing(id) {
        const jsonObject = await this.serverModule.loadDrawing(id)
        console.log(jsonObject)
        this.clearAll()
        if (!Array.isArray(jsonObject.shapes)){
            jsonObject.shapes = [jsonObject.shapes]
        }

        for (let i = 0; i < jsonObject.shapes.length; i++){
            if (jsonObject.shapes[i].borderPoint.length == 8){
                let tmpArr = []
                for (let j = 0; j < jsonObject.shapes[i].borderPoint.length-1; j+=2){
                    tmpArr.push([Number(jsonObject.shapes[i].borderPoint[j]), Number(jsonObject.shapes[i].borderPoint[j+1])])
                }
                jsonObject.shapes[i].borderPoint = tmpArr
            }
            else break
        }
        
        console.log("hohoho")
        console.log(jsonObject)
        this.shapes = this.shapeBuilder.createShapes(jsonObject.shapes)
        console.log(this.shapes)
    }

    async loadImages() {
        return await this.serverModule.loadImages()
    }
    
    incOneLayer(){
        this.addShapesToUndo()
        if (this.selectedShapeIdx == this.shapes.length - 1)
            return
        let tmp = this.shapes[this.selectedShapeIdx + 1]
        this.shapes[this.selectedShapeIdx + 1] = this.selectedShape
        this.shapes[this.selectedShapeIdx] = tmp
        this.selectedShapeIdx++
    }

    decOneLayer(){
        this.addShapesToUndo()
        if (this.selectedShapeIdx == 0)
            return
        let tmp = this.shapes[this.selectedShapeIdx - 1]
        this.shapes[this.selectedShapeIdx - 1] = this.selectedShape
        this.shapes[this.selectedShapeIdx] = tmp
        this.selectedShapeIdx--
    }

    incToTopLayer(){
        this.addShapesToUndo()
        for (let i = this.selectedShapeIdx; i < this.shapes.length - 1; i++){
            let tmp = this.shapes[this.selectedShapeIdx + 1]
            this.shapes[this.selectedShapeIdx + 1] = this.selectedShape
            this.shapes[this.selectedShapeIdx] = tmp
            this.selectedShapeIdx++
        }
    }

    decToBotLayer(){
        this.addShapesToUndo()
        for (let i = this.selectedShapeIdx; i > 0; i--){
            let tmp = this.shapes[this.selectedShapeIdx - 1]
            this.shapes[this.selectedShapeIdx - 1] = this.selectedShape
            this.shapes[this.selectedShapeIdx] = tmp
            this.selectedShapeIdx--
        }
    }

    async saveToLocal(){
        this.serverModule.saveFileToLocal(this.shapes)
    }

    async loadFromLocal(){
        this.clearAll()
        this.shapes = this.shapeBuilder.createShapes(await this.serverModule.loadFileFromLocal(this.shapes))
        console.log(this.shapes)
    }
    
}

export default Drawing;