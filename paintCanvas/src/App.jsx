import { useRef, useEffect } from 'react'
import ShapeFactory from './shapes/classes'
import './App.css'

function App() {

  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const shapeRef = useRef(null)
  const shapeSelectedRef = useRef(false)
  const shapeFactoryRef = useRef(null)
  const shapes = useRef([])
  const currentIndexRef = useRef(0)  //2304-->Ref to store the current index for undo/redo

  const selectShape = (shapeType) => {
    shapeSelectedRef.current = true;
    shapeRef.current = shapeFactoryRef.current.createShape(shapeType)
    console.log("shape " + shapeType + " selected")
  }
//2304-->start////////////////////////////////////
  //2304-->Updated renderCanva ///////////////////
  const renderCanva = (canva, last) => {
    canva.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    if (last === 0) {
      return;
    }
    for (let i = 0; i < last; i++) {
      shapes.current[i].draw(canva)
    }
    currentIndexRef.current = last
  }
  //2304-->Undo function
  const undo = () => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current -= 1
      renderCanva(canvasRef.current.getContext('2d'), currentIndexRef.current)
    } else {
      renderCanva(canvasRef.current.getContext('2d'), 0)
    }
  }
  //2304-->Redo function
  const redo = () => {
    if (currentIndexRef.current < shapes.current.length) {
      currentIndexRef.current += 1
      renderCanva(canvasRef.current.getContext('2d'), currentIndexRef.current)
    }
  }
//2304<--end////////////////////////////////////

  const startDrawing = (e) => {
    if (!shapeSelectedRef.current) return;
    isDrawingRef.current = true
    const mouseX = e.offsetX
    const mouseY = e.offsetY
    shapes.current = shapes.current.slice(0, currentIndexRef.current)//2304-->on new shape after undo/redo Slice till currentIndex
    shapes.current.push(shapeRef.current)
    currentIndexRef.current = shapes.current.length //2304-->Update currentIndex to the last shape
    shapeRef.current.setStartPoint(mouseX, mouseY)
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return
    const mouseX = e.offsetX
    const mouseY = e.offsetY
    shapeRef.current.setEndPoint(mouseX, mouseY)
    shapes.current[shapes.current.length - 1] = shapeRef.current.clone()
    renderCanva(canvasRef.current.getContext('2d'), currentIndexRef.current) //2304-->Render to the current shape
  };

  const stopDrawing = (e) => {
    if (!shapeSelectedRef.current || !isDrawingRef.current) return
    isDrawingRef.current = false
  };

  useEffect(() => {
    const canva = canvasRef.current.getContext('2d')
    shapeFactoryRef.current = new ShapeFactory()

    canvasRef.current.addEventListener('mousedown', startDrawing)
    canvasRef.current.addEventListener('mousemove', draw)
    canvasRef.current.addEventListener('mouseup', stopDrawing)

    return () => {
      canvasRef.current.removeEventListener('mousedown', startDrawing)
      canvasRef.current.removeEventListener('mousemove', draw)
      canvasRef.current.removeEventListener('mouseup', stopDrawing)
    };
  }, [])

  return (
    <>
      <div>
        <div>
          <button className='button'  >delete</button>
          <button className='button' onClick={() => selectShape("line")}>line</button>
          <button className='button' onClick={() => selectShape("square")}>square</button>
          <button className='button' onClick={() => selectShape("rectangle")}>rectangle</button>
          <button className='button' onClick={() => selectShape("circle")}>circle</button>
          <button className='button' onClick={() => selectShape("ellipse")}>ellipse</button>
          <button className='button' onClick={() => selectShape("triangle")}>triangle</button>

        </div>
        <canvas ref={canvasRef} id="canvas" width="600" height="400" style={{ border: '1px solid black' }}>nnnn</canvas>

        {/* Undo/Redo Buttons */}
        <div>
          <button className='button'  onClick={undo}>undo</button>
          <button className='button'  onClick={redo}>redo</button>
        </div>
      </div>
    </>
  )
}

export default App
