import {  useRef, useEffect } from 'react'
import Drawing from './drawing'
import './App.css'


function TestApp() {

  const canvasRef = useRef(null)
  const drawingRef = useRef(null)
  const canvaContextRef = useRef(null)
  
  
  const colorListRef = useRef(null);           //230 boolean to show colors list
  const backListRef = useRef(null);            //230 boolean to show stroke list
  const thickListRef = useRef(null);           //230 boolean to show style list
  const sidebarRef = useRef(null);             //230 Ref to the sidebar element
  const sidebarVisibleRef = useRef(false);     //230 boolean to toggle side bar visibility

  
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
  const toggleThickList = () => {
    if (thickListRef.current.style.display === 'none' || thickListRef.current.style.display === '') {
      thickListRef.current.style.display = 'block';
    } else {
      thickListRef.current.style.display = 'none';
    }
  };
  
  const showSideBar = () => {
    sidebarVisibleRef.current = true;
    sidebarRef.current.style.display = 'block';
  }

  const hideSideBar = () => {
    sidebarRef.current.style.display = 'none'
    sidebarVisibleRef.current = false
  }

  const changeColor = (color) => {
    drawingRef.current.setSelectedColor(color)
    
    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
  }
  const changeBackColor = (color) => {
    drawingRef.current.setSelectedBackgroundColor(color)
    
    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
  }
  const changeThickness = (value) => {
    drawingRef.current.setSelectedThickness(value)

    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
  }

  const selectShape = (shapeType) => {
    drawingRef.current.setDrawingMode()
    drawingRef.current.selectDrawingShape(shapeType)
    showSideBar()
  }

  const selectMode = () => {
    drawingRef.current.setSelectMode()
    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
    //hideSideBar()
  }

  const renderCanva = (canva, shapes) => {
    canva.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].draw(canva)
      }
  }

  const undo = () => {
  
    renderCanva(canvaContextRef.current, drawingRef.current.getShapesCopyUndo())
  }
  const redo = () => {
    renderCanva(canvaContextRef.current, drawingRef.current.getShapesCopyRedo())
  }


  const deleteShape = () => {
    drawingRef.current.deleteShape()
    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
  }

  useEffect(() => {
    canvaContextRef.current = canvasRef.current.getContext('2d')
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
        // renderCanva(canvaContextRef.current, drawingRef.current.getShapes()) // this is a problem
    };

    const mouseUp = (e) => {
        drawingRef.current.mouseUp()
        renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
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
                      <button className="colorOption" style={{ backgroundColor: 'red'}}    onClick={() => (changeColor('red'))}></button>
                      <button className="colorOption" style={{ backgroundColor: 'blue'}}   onClick={() => (changeColor('blue'))}></button>
                      <button className="colorOption" style={{ backgroundColor: 'green'}} onClick={() => (changeColor('green'))}></button>
                      <button className="colorOption" style={{ backgroundColor: 'yellow'}} onClick={() => (changeColor('yellow'))}></button>
                      <button className="colorOption" style={{ backgroundColor: '#ff00ff'}} onClick={() => (changeColor('#ff00ff'))}></button>
                      <button className="colorOption" style={{ backgroundColor: '#ff6f91'}} onClick={() => (changeColor('#ff6f91'))}></button>
                      <button className="colorOption" style={{ backgroundColor: '#008080'}} onClick={() => (changeColor('#008080'))}></button>
                      <button className="colorOption" style={{ backgroundColor: '#ffa500'}} onClick={() => (changeColor('#ffa500'))}></button>
                      <button className="colorOption" style={{ backgroundColor: '#800080'}} onClick={() => (changeColor('#800080'))}></button>
                  </div>
              <button className='opButton' onClick={toggleBackList}>Background</button>
                  <div ref={backListRef} style={{ display: 'none' }} className="colorList">
                      <button className="colorOption" style={{ backgroundColor: 'red' }}    onClick={() => (changeBackColor('red'))}></button>
                      <button className="colorOption" style={{ backgroundColor: 'blue'}}   onClick={() => (changeBackColor('blue'))}></button>
                      <button className="colorOption" style={{ backgroundColor: 'green'}} onClick={() => (changeBackColor('green'))}></button>
                      <button className="colorOption" style={{ backgroundColor: 'yellow'}} onClick={() => (changeBackColor('yellow'))}></button>
                      <button className="colorOption" style={{ backgroundColor: '#ff00ff'}} onClick={() => (changeBackColor('#ff00ff'))}></button>
                      <button className="colorOption" style={{ backgroundColor: '#ff6f91'}} onClick={() => (changeBackColor('#ff6f91'))}></button>
                      <button className="colorOption" style={{ backgroundColor: '#008080'}} onClick={() => (changeBackColor('#008080'))}></button>
                      <button className="colorOption" style={{ backgroundColor: '#ffa500'}} onClick={() => (changeBackColor('#ffa500'))}></button>
                      <button className="colorOption" style={{ backgroundColor: '#800080'}} onClick={() => (changeBackColor('#800080'))}></button>
                  </div>
              <button className='opButton' onClick={toggleThickList}>Thickness </button>
                  <div ref={thickListRef} style={{ display: 'none' }} className="colorList">
                  <input
                      type="number"
                      className="thicknessInput"
                      placeholder='thickness'
                      onChange={(e) => {
                        changeThickness(e.target.value)
                      }}
                    />
                  </div>
          </div>

          <div className='appContainer'>
              <div className='shapesContainer' >
                <button className='button' onClick={() => selectMode()}>select</button>
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
                <button className="button" onClick={deleteShape}>delete</button>
              </div>
          </div>
      </div>
    </>
  )
}

export default TestApp
