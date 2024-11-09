import {  useRef, useEffect } from 'react'
import ShapeFactory from './classes'

function App() {

  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const shapeRef = useRef(null)
  const shapeSelectedRef = useRef(false)
  const ismovingRef = useRef(false)
  const shapeFactoryRef = useRef(null)
  const shapes = useRef([])

  const selectShape = (shapeType) => {
    shapeSelectedRef.current =  true;
    shapeRef.current = shapeFactoryRef.current.createShape(shapeType)
  }

  const renderCanva = (canva) => {
    canva.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    if (last === 0) {
      return;
    }
    for (let i = 0; i < last; i++) {
      shapes.current[i].draw(canva)
    }
  }

  useEffect(() => {
    const canva = canvasRef.current.getContext('2d')
    shapeFactoryRef.current = new ShapeFactory()

    const startDrawing = (e) => {
      if (!shapeSelectedRef.current)
        return;
      isDrawingRef.current = true
      const mouseX = e.offsetX
      const mouseY = e.offsetY
      shapes.current.push(shapeRef.current)
      console.log(shapes.current.length)
      shapeRef.current.setStartPoint(mouseX, mouseY)
      // console.log("starting point: " + mouseX + " " + mouseY)
    };

    const draw = (e) => {
      if (!isDrawingRef.current) return
      const mouseX = e.offsetX
      const mouseY = e.offsetY
      shapeRef.current.setEndPoint(mouseX, mouseY)
      shapes.current[shapes.current.length - 1] = shapeRef.current.clone()
      renderCanva(canva)
    };

    const stopDrawing = (e) => {
      if (!shapeSelectedRef.current || !isDrawingRef.current)
        return
      isDrawingRef.current = false
    };

    canvasRef.current.addEventListener('mousedown', startDrawing)
    canvasRef.current.addEventListener('mousemove', draw)
    canvasRef.current.addEventListener('mouseup', stopDrawing)
    // canvasRef.current.addEventListener('mouseleave', stopDrawing)

    return () => {
      canvasRef.current.removeEventListener('mousedown', startDrawing)
      canvasRef.current.removeEventListener('mousemove', draw)
      canvasRef.current.removeEventListener('mouseup', stopDrawing)
      // canvasRef.current.removeEventListener('mouseleave', stopDrawing)
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
      </div>
    </>
  )
}

export default App
