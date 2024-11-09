import {  useRef, useEffect ,useState} from 'react'

import ShapeFactory from './shapes/classes'
import './App.css'


function App() {

  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const shapeRef = useRef(null)
  const shapeSelectedRef = useRef(false)
  const ismovingRef = useRef(false)
  const shapeFactoryRef = useRef(null)
  const shapes = useRef([])
   const currentIndexRef = useRef(0) 

  const indexRef = useRef(null)
  
  

  const selectShape = (shapeType) => {
    shapeSelectedRef.current =  true;
    shapeRef.current = shapeFactoryRef.current.createShape(shapeType)
  }

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
  const checkSelection = (x, y) => {
    for (let i = 0; i < shapes.current.length; i++) {
        if (shapes.current[i].isSelected(x, y)) {
            return { found: true, index: i };
        }
    }
    return { found: false, index: -1 };
  };
  //2304-->start////////////////////////////////////
  //2304-->Updated renderCanva ///////////////////
 
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
  

  useEffect(() => {
    const canva = canvasRef.current.getContext('2d')
    shapeFactoryRef.current = new ShapeFactory()

    const mousedown = (e) => {
      const mouseX = e.offsetX
      const mouseY = e.offsetY
      
      let {found, index} = checkSelection(mouseX,mouseY)
      
      if (found) {
        
        shapes.current[index].setColor('blue'); 
         
        ismovingRef.current =true;
        indexRef.current = index
        renderCanva(canva,currentIndexRef.current)
      }else{
        if (!shapeSelectedRef.current)
          return;
        shapes.current = shapes.current.slice(0, currentIndexRef.current)//2304-->on new shape after undo/redo Slice till currentIndex
        shapes.current.push(shapeRef.current)
        currentIndexRef.current = shapes.current.length //2304-->Update currentIndex to the last shape
     
        shapeRef.current.setStartPoint(mouseX, mouseY)
        isDrawingRef.current = true
      }
    };
    
    let oldMouseX = 0;
    let oldMouseY = 0;
    const mousemove = (e) => {
      const mouseX = e.offsetX
      const mouseY = e.offsetY
      
      if (isDrawingRef.current){
        shapeRef.current.setEndPoint(mouseX, mouseY)
        shapes.current[shapes.current.length - 1] = shapeRef.current.clone()
        renderCanva(canva,currentIndexRef.current)
      }else if (ismovingRef.current && indexRef.current !== null) {
        if (oldMouseX!=0 || oldMouseY!=0)
          shapes.current[indexRef.current].move(mouseX-oldMouseX, mouseY-oldMouseY) 
        oldMouseX = mouseX;
        oldMouseY = mouseY;

        renderCanva(canva,currentIndexRef.current)
      }
    };

    const mouseup = (e) => {
      if (shapeSelectedRef.current && isDrawingRef.current){ 
        isDrawingRef.current = false
      }
      else{
        shapes.current[indexRef.current].setColor('black');
        renderCanva(canva,currentIndexRef.current)
        ismovingRef.current = false 
        indexRef.current = null
        oldMouseX = 0
        oldMouseY = 0
      }
    };

    canvasRef.current.addEventListener('mousedown', mousedown)
    canvasRef.current.addEventListener('mousemove', mousemove)
    canvasRef.current.addEventListener('mouseup', mouseup)
    
    return () => {
      canvasRef.current.removeEventListener('mousedown', mousedown)
      canvasRef.current.removeEventListener('mousemove', mousemove)
      canvasRef.current.removeEventListener('mouseup', mouseup)
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
        <div>
          <button className='button'  onClick={undo}>undo</button>
          <button className='button'  onClick={redo}>redo</button>
        </div>
      </div>
    </>
  )
}

export default App
