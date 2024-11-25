import {  useRef, useEffect } from 'react'
import ShapeFactory from './shapes/shapeFactory'
import Drawing from './drawing'
import './App.css'


function TestApp() {

  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const shapeRef = useRef(null)
  const shapeSelectedRef = useRef(false)
  const ismovingRef = useRef(false)
  const shapeFactoryRef = useRef(null)
  const shapes = useRef([])
  const currentIndexRef = useRef(null)
  const indexRef = useRef(null)
  const drawingRef = useRef(null)
  
  
  const colorListRef = useRef(null);           //230 boolean to show colors list
  const backListRef = useRef(null);            //230 boolean to show stroke list
  const sizeListRef = useRef(null);            //230 boolean to show size list
  const thickListRef = useRef(null);           //230 boolean to show style list
  const sidebarRef = useRef(null);             //230 Ref to the sidebar element
  const sidebarVisibleRef = useRef(false);     //230 boolean to toggle side bar visibility
  const selectedColorRef = useRef('black')     //230 Ref to select shape color
  const backColorRef = useRef('transparent')   //230 Ref to select shape backcolor
  const thicknessValueRef = useRef('4')        //230 Ref to select thicknessValue
  const deleteRef = useRef(false)              //230 boolean to delete selected element
  const addChangeRef = useRef(false)           //230 bool user will change options
  const a=useRef(false),b =useRef(false)       //230 bool user will change specifically
  
  //230->functions to toggle the display of the options buttons lists//////////
  const toggleColorList = () => {
    if (colorListRef.current.style.display === 'none' || colorListRef.current.style.display === '') {
      colorListRef.current.style.display = 'block';
    } else {
      colorListRef.current.style.display = 'none';
    }
  };
  const toggleBackList = () => {
    if (backListRef.current.style.display === 'none' || backListRef.current.style.display === '') {
      backListRef.current.style.display = 'block';
    } else {
      backListRef.current.style.display = 'none';
    }
  };
  const toggleSizeList = () => {
    if (sizeListRef.current.style.display === 'none' || sizeListRef.current.style.display === '') {
      sizeListRef.current.style.display = 'block';
    } else {
      sizeListRef.current.style.display = 'none';
    }
  };
  const toggleThickList = () => {
    if (thickListRef.current.style.display === 'none' || thickListRef.current.style.display === '') {
      thickListRef.current.style.display = 'block';
    } else {
      thickListRef.current.style.display = 'none';
    }
  };
  const changeColor = (color) => {
    selectedColorRef.current = color
  }
  const changeBackColor = (color) => {
    backColorRef.current = color
  }
  const shapeOptions = (i) =>{
    if(a.current){
    shapes.current[i.current].setColor(selectedColorRef.current)
    }
    else if(b.current){
      shapes.current[i.current].setBackColor(backColorRef.current)
    }
    else if(thicknessValueRef.current){
      shapes.current[i.current].setThick(thicknessValueRef.current)
    }
    if(deleteRef.current === true){
      shapes.current.splice(i.current, 1);
        deleteRef.current = false
    }
    addChangeRef.current = false
    a.current = false
    b.current = false
    thicknessValueRef.current = 4
  }
  ///////////////////230<-end////////////////////////////////////////////

  const selectShape = (shapeType) => {
    drawingRef.current.setDrawingMode()
    drawingRef.current.selectDrawingShape(shapeType)

    // sidebarVisibleRef.current = true;             //230 function Show sidebar on shape selection
    // if (sidebarRef.current) {                     //230
    //   sidebarRef.current.style.display = 'block'; //230
    // }                                             //230 end
  }

  const renderCanva = (canva, shapes) => {
    canva.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    for (let i = 0; i < shapes.length; i++) {
      shapes[i].draw(canva)
    }
  }
  
  const checkSelection = (x, y) => {
    for (let i = 0; i < shapes.current.length; i++) {
        if (shapes.current[i].isSelected(x, y)) {
            return { found: true, index: i };
        }
    }
    return { found: false, index: -1 };
  };

  //2304-->Undo function
  const undo = () => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current -= 1
      renderCanva(canvasRef.current.getContext('2d'))
    } else {
      renderCanva(canvasRef.current.getContext('2d'))
    }
  }
  //2304-->Redo function
  const redo = () => {
    if (currentIndexRef.current < shapes.current.length) {
      currentIndexRef.current += 1
      renderCanva(canvasRef.current.getContext('2d'))
    }
  }


  useEffect(() => {
    const canva = canvasRef.current.getContext('2d')
    shapeFactoryRef.current = new ShapeFactory()
    drawingRef.current = new Drawing()

    const mouseDown = (e) => {
      const mouseX = e.offsetX
      const mouseY = e.offsetY
      drawingRef.current.mouseDown(mouseX, mouseY)
    };

    const mouseMove = (e) => {
        const mouseX = e.offsetX
        const mouseY = e.offsetY
        drawingRef.current.mouseMove(mouseX, mouseY)
        renderCanva(canva, drawingRef.current.getShapes()) // this is a problem
    };

    const mouseUp = (e) => {
        drawingRef.current.mouseUp()
        renderCanva(canva, drawingRef.current.getShapes())
    };

    canvasRef.current.addEventListener('mousedown', mouseDown)
    canvasRef.current.addEventListener('mousemove', mouseMove)
    canvasRef.current.addEventListener('mouseup', mouseUp)
    
    return () => {
      canvasRef.current.removeEventListener('mousedown', mouseDown)
      canvasRef.current.removeEventListener('mousemove', mouseMove)
      canvasRef.current.removeEventListener('mouseup', mouseUp)
    };
  }, [])


  return (
    <>
      <div className='page'>
          <div ref={sidebarRef} className='sidebar' style={{ display: 'none' }}>
              <h3>Shape Options</h3>
              <button className='opButton'  onClick={toggleColorList}>Color </button>
                  <div ref={colorListRef} style={{ display: 'none' }} className="colorList">
                      <button className="colorOption" style={{ backgroundColor: 'red' }}    onClick={() => (changeColor('red'),addChangeRef.current = true,a.current=true)}>red</button>
                      <button className="colorOption" style={{ backgroundColor: 'blue' }}   onClick={() => (changeColor('blue'),addChangeRef.current = true,a.current=true)}>blue</button>
                      <button className="colorOption" style={{ backgroundColor: 'green'  }} onClick={() => (changeColor('green'),addChangeRef.current = true,a.current=true)}>green</button>
                      <button className="colorOption" style={{ backgroundColor: 'yellow' }} onClick={() => (changeColor('yellow'),addChangeRef.current = true,a.current=true)}>yellow</button>
                      <button className="colorOption" style={{ backgroundColor: '#ff00ff'}} onClick={() => (changeColor('#ff00ff'),addChangeRef.current = true,a.current=true)}>maginta</button>
                      <button className="colorOption" style={{ backgroundColor: '#ff6f91'}} onClick={() => (changeColor('#ff6f91'),addChangeRef.current = true,a.current=true)}>pinkish</button>
                      <button className="colorOption" style={{ backgroundColor: '#008080'}} onClick={() => (changeColor('#008080'),addChangeRef.current = true,a.current=true)}>teal</button>
                      <button className="colorOption" style={{ backgroundColor: '#ffa500'}} onClick={() => (changeColor('#ffa500'),addChangeRef.current = true,a.current=true)}>orange</button>
                      <button className="colorOption" style={{ backgroundColor: '#800080'}} onClick={() => (changeColor('#800080'),addChangeRef.current = true,a.current=true)}>purple</button>
                  </div>
              <button className='opButton' onClick={toggleBackList}>Background</button>
                  <div ref={backListRef} style={{ display: 'none' }} className="colorList">
                      <button className="colorOption" style={{ backgroundColor: 'red' }}    onClick={() => (changeBackColor('red'),addChangeRef.current = true,b.current=true)}>red</button>
                      <button className="colorOption" style={{ backgroundColor: 'blue' }}   onClick={() => (changeBackColor('blue'),addChangeRef.current = true,b.current=true)}>blue</button>
                      <button className="colorOption" style={{ backgroundColor: 'green'  }} onClick={() => (changeBackColor('green'),addChangeRef.current = true,b.current=true)}>green</button>
                      <button className="colorOption" style={{ backgroundColor: 'yellow' }} onClick={() => (changeBackColor('yellow'),addChangeRef.current = true,b.current=true)}>yellow</button>
                      <button className="colorOption" style={{ backgroundColor: '#ff00ff'}} onClick={() => (changeBackColor('#ff00ff'),addChangeRef.current = true,b.current=true)}>maginta</button>
                      <button className="colorOption" style={{ backgroundColor: '#ff6f91'}} onClick={() => (changeBackColor('#ff6f91'),addChangeRef.current = true,b.current=true)}>pinkish</button>
                      <button className="colorOption" style={{ backgroundColor: '#008080'}} onClick={() => (changeBackColor('#008080'),addChangeRef.current = true,b.current=true)}>teal</button>
                      <button className="colorOption" style={{ backgroundColor: '#ffa500'}} onClick={() => (changeBackColor('#ffa500'),addChangeRef.current = true,b.current=true)}>orange</button>
                      <button className="colorOption" style={{ backgroundColor: '#800080'}} onClick={() => (changeBackColor('#800080'),addChangeRef.current = true,b.current=true)}>purple</button>
                  </div>
              <button className='opButton' onClick={toggleSizeList}>Size  </button>
                  <div ref={sizeListRef} style={{ display: 'none' }} className="colorList">
                      <button className="sizeOption" >size</button>
                      {/* Add buttons here */}
                  </div>
              <button className='opButton' onClick={toggleThickList}>Thickness </button>
                  <div ref={thickListRef} style={{ display: 'none' }} className="colorList">
                  <input
                      type="number"
                      className="thicknessInput"
                      placeholder='thickness'
                      onChange={(e) => {
                        addChangeRef.current = true;
                        thicknessValueRef.current = e.target.value;
                      }}
                    />
                  </div>
          </div>

          <div className='appContainer'>
              <div className='shapesContainer' >
                <button className='button' onClick={() => selectShape("line")}>line</button>
                <button className='button' onClick={() => selectShape("square")}>square</button>
                <button className='button' onClick={() => selectShape("rectangle")}>rectangle</button>
                <button className='button' onClick={() => selectShape("circle")}>circle</button>
                <button className='button' onClick={() => selectShape("ellipse")}>ellipse</button>
                <button className='button' onClick={() => selectShape("triangle")}>triangle</button>
                <button className='button' onClick={() => selectShape("draw")}>draw</button>
              </div >

              <canvas ref={canvasRef} id="canvas" width="600" height="400" style={{ border: '1px solid black' }}></canvas>
              
              <div>
                <button className='button'  onClick={undo}>undo</button>
                <button className='button'  onClick={redo}>redo</button>
                <button className="button" onClick={() => (deleteRef.current = true,addChangeRef.current = true)}>delete</button>
              </div>
          </div>
      </div>
    </>
  )
}

export default TestApp
