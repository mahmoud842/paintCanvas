import {  useRef, useEffect, useState } from 'react'
import Drawing from './drawing'
import './App.css'
import transparent from './assets/transparent.png'
import down_arrow from './assets/down_arrow.png'
import down_arrow_wall from './assets/down_arrow_wall.png'
import up_arrow from './assets/up_arrow.png'
import up_arrow_wall from './assets/up_arrow_wall.png'
import delete_img from './assets/delete.png'
import copy_img from './assets/copy.png'
import cut_img from './assets/scissors.png'
import folder_img from './assets/folder.png'
import eraser_img from './assets/eraser.png'
import diskette_img from './assets/diskette.png'


function TestApp() {

  const canvasRef = useRef(null)
  const drawingRef = useRef(null)
  const canvaContextRef = useRef(null)
  const ClintPostionRef = useRef(null)

  const sidebarRef = useRef(null)              //Ref to the sidebar element
  const sidebarVisibleRef = useRef(false)      //boolean to toggle side bar visibility

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const inputColorRef = useRef("#000000")
  const inputBGColorRef = useRef('#000000')
  const inputThicknessRef = useRef(4)

  const colorChangeRef = useRef(false)
  const backgroundColorChangeRef = useRef(false)

  const loadScreenRef = useRef(null)
  const [loadImages, setLoadImages] = useState([])

  const loadMenuRef = useRef(null)
  const saveMenuRef = useRef(null)
  const saveToServerMenu = useRef(null)

  const zoomLevelRef = useRef(1)
  const offSetRef = useRef([0,0])
  const altKeyRef = useRef(false)
  const isDragRef = useRef(false)
  const startDragRef = useRef([0,0])

  const displayLoadScreen = async () => {
    setLoadImages(await drawingRef.current.loadImages())
    loadScreenRef.current.style.display = 'flex';
  }

  const closeLoadScreen = () => {
    loadScreenRef.current.style.display = 'none';
  }
  
  const showSideBar = () => {
    sidebarVisibleRef.current = true;
    sidebarRef.current.style.display = 'block';
  }

  const hideSideBar = () => {
    sidebarRef.current.style.display = 'none'
    sidebarVisibleRef.current = false
  }

  const changeColor = (color) => {
    if (!colorChangeRef.current){
      drawingRef.current.addShapesToUndo()
      colorChangeRef.current = true
    }
    drawingRef.current.setSelectedColor(color)
    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
  }
  const changeBackColor = (color) => {
    if (!backgroundColorChangeRef.current){
      drawingRef.current.addShapesToUndo()
      backgroundColorChangeRef.current = true
    }
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
    updateInputProperties()
  }

  const selectMode = () => {
    drawingRef.current.setSelectMode()
    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
    hideSideBar()
  }

  const renderCanva = (canva, shapes) => {
    canva.setTransform(zoomLevelRef.current, 0, 0, zoomLevelRef.current, offSetRef.current[0], offSetRef.current[1])
    canva.clearRect(-offSetRef.current[0] / zoomLevelRef.current, -offSetRef.current[1] / zoomLevelRef.current, canvas.width / zoomLevelRef.current, canvas.height / zoomLevelRef.current)
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].draw(canva)
      }
  }

  const undo = () => {
    drawingRef.current.undo()
    hideSideBar()
    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
  }
  const redo = () => {
    drawingRef.current.redo()
    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
  }

  const deleteShape = () => {
    if (drawingRef.current.deleteShape())
      hideSideBar()
    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
  }

  const realMouse = (x, y) => {
    return [(x- offSetRef.current[0]) / zoomLevelRef.current, (y - offSetRef.current[1]) / zoomLevelRef.current]
  }

  const updateInputProperties = () => {
    let properties = drawingRef.current.getSelectedShapeProperties()
    if (properties != null){
      inputColorRef.current.value = properties.color
      if (properties.backgroundColor !== 'transparent')
        inputBGColorRef.current.value = properties.backgroundColor
      inputThicknessRef.current.value = properties.thickness
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const clear = () => {
    drawingRef.current.clear()
    hideSideBar()
    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
  }

  const hideSaveMenu = () => {
    saveMenuRef.current.style.display = 'none'
  }

  const showSaveMenu = () => {
    saveMenuRef.current.style.display = 'block'
  }

  const showSaveToServerMenu = () => {
    saveToServerMenu.current.style.display = 'block'
  }

  const hideSaveToServerMenu = () => {
    saveToServerMenu.current.style.display = 'none'
  }

  const hideLoadMenu = () => {
    loadMenuRef.current.style.display = 'none'
  }

  const showLoadMenu = () => {
    loadMenuRef.current.style.display = 'block'
  }

  useEffect(() => {
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight
    canvaContextRef.current = canvasRef.current.getContext('2d')
    drawingRef.current = new Drawing()

    const mouseDown = (e) => {
      let [mouseX, mouseY] = [e.offsetX, e.offsetY]
      if (altKeyRef.current){
        isDragRef.current = true
        startDragRef.current[0] = mouseX - offSetRef.current[0]
        startDragRef.current[1] = mouseY - offSetRef.current[1]
      }
      else {
        [mouseX, mouseY] = realMouse(e.offsetX, e.offsetY)
        drawingRef.current.mouseDown(mouseX, mouseY)
      }
      if (!drawingRef.current.isSelected())
        hideSideBar()
      else {
        updateInputProperties()
        showSideBar()
      }
    };

    const mouseMove = (e) => {
        let [mouseX, mouseY] = [e.offsetX, e.offsetY]
        ClintPostionRef.current = realMouse(e.offsetX, e.offsetY)
        if (isDragRef.current){
          offSetRef.current[0] = mouseX - startDragRef.current[0]
          offSetRef.current[1] = mouseY - startDragRef.current[1]
        }
        else {
          [mouseX, mouseY] = realMouse(e.offsetX, e.offsetY)
          drawingRef.current.mouseMove(mouseX, mouseY)
        }
        renderCanva(canvaContextRef.current, drawingRef.current.getShapes()) // this is a problem
    };

    const mouseUp = (e) => {
      if (isDragRef.current)
        isDragRef.current = false
      else 
        drawingRef.current.mouseUp()
      renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
    };

    const handleButtonPress = (e) => {
      if (e.key === 'Alt') 
        altKeyRef.current = true
      else if (e.ctrlKey && (e.key === 'c' || e.key === 'C'))
        drawingRef.current.copyCommand()
      else if (e.ctrlKey && (e.key === 'v' || e.key === 'V')){
        drawingRef.current.pastCommand(ClintPostionRef.current)
        renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
      }
      else if (e.ctrlKey && (e.key === 'x' || e.key === 'X')){
        drawingRef.current.cutCommand()
        renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
      }else if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')){
        undo()
      }else if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')){
        redo()
      }else if (e.key === 'Delete'){
        deleteShape()
      }
    }

    const handleAltRelease = (e) => {
      if (e.key === 'Alt') {
        altKeyRef.current = false
      }
    }

    const wheelAction = (e) => {
      e.preventDefault()
      const scaleFactor = 1.1; // Zoom speed
      const mouseX = (e.clientX - offSetRef.current[0]) / zoomLevelRef.current
      const mouseY = (e.clientY - offSetRef.current[1]) / zoomLevelRef.current
  
      if (e.deltaY < 0) {
          // Zoom in
          zoomLevelRef.current *= scaleFactor
      } else {
          // Zoom out
          zoomLevelRef.current /= scaleFactor
      }
  
      // Adjust pan to keep zoom centered on mouse position
      offSetRef.current[0] = e.clientX - mouseX * zoomLevelRef.current
      offSetRef.current[1] = e.clientY - mouseY * zoomLevelRef.current
  
      renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
    }

    canvasRef.current.addEventListener('wheel', wheelAction)
    canvasRef.current.addEventListener('mousedown', mouseDown)
    canvasRef.current.addEventListener('mousemove', mouseMove)
    canvasRef.current.addEventListener('mouseup', mouseUp)
    document.addEventListener('keydown', handleButtonPress)
    document.addEventListener('keyup', handleAltRelease)
    
    return () => {
      canvasRef.current.removeEventListener('wheel', wheelAction)
      canvasRef.current.removeEventListener('mousedown', mouseDown)
      canvasRef.current.removeEventListener('mousemove', mouseMove)
      canvasRef.current.removeEventListener('mouseup', mouseUp)
      document.removeEventListener('keydown', handleButtonPress)
      document.removeEventListener('keyup', handleAltRelease)
    };
  }, [])


  return (
    <>
      <div className='page'>
          <div ref={sidebarRef} className='side-bar'>
              <div className="propertie-list">
                <div className="propertie-type">Color:</div>
                <input ref={inputColorRef} type="color" className="color-input" 
                  onChange={(e) => {
                    changeColor(e.target.value)
                  }}
                  onBlur={(e) => {
                    colorChangeRef.current = false
                  }}
                />
              </div>

              <div className="propertie-list">
                <div className="propertie-type">Background:</div>
                <input ref={inputBGColorRef} type="color" className="color-input" 
                  onChange={(e) => {
                    changeBackColor(e.target.value)
                  }}
                  onBlur={(e) => {
                    backgroundColorChangeRef.current = false
                  }}
                />
                <button className='transparent-button' onClick={() =>{
                  changeBackColor('transparent')
                  backgroundColorChangeRef.current = false
                }}><img src={transparent} alt="transparent" /></button>
              </div>

              <div className='propertie-list'>
                <div className="propertie-type">Thickness:</div>
                <input
                    ref={inputThicknessRef}
                    min="1" max="10"
                    type="number"
                    className="thickness-input"
                    placeholder='thickness'
                    onChange={(e) => {
                      changeThickness(e.target.value)
                    }}
                  />
              </div>

              <div className="buttons-propertie">
                <div className="propertie-type">Layer</div>
                <div className='action-button-list'>
                  <button className='action-button' onClick={() => {
                    drawingRef.current.decToBotLayer()
                    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
                  }}>
                    <img src={down_arrow_wall} alt="transparent" />
                  </button>
                  <button className='action-button' onClick={() => {
                    drawingRef.current.decOneLayer()
                    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
                  }}>
                    <img src={down_arrow} alt="transparent" />
                  </button>
                  <button className='action-button' onClick={() => {
                    drawingRef.current.incOneLayer()
                    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
                  }}>
                    <img src={up_arrow} alt="transparent" />
                  </button>
                  <button className='action-button' onClick={() => {
                    drawingRef.current.incToTopLayer()
                    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
                  }}>
                    <img src={up_arrow_wall} alt="transparent" />
                  </button>
                </div>
              </div>
              
              <div className="buttons-propertie">
                <div className="propertie-type">Actions</div>
                <div className='action-button-list'>
                  <button className="action-button" onClick={deleteShape}>
                    <img src={delete_img} alt="transparent" />
                  </button>
                  <button className="action-button" onClick={()=>{
                    drawingRef.current.copyCommand()
                  }}>
                    <img src={copy_img} alt="transparent" />
                  </button>
                  <button className="action-button" onClick={()=>{
                    drawingRef.current.cutCommand()
                    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
                  }}>
                    <img src={cut_img} alt="transparent" />
                  </button>
                </div>
              </div>
          </div>
          
          <div className='shapes-container'>
            {/* <button className='button' onClick={async () => {
              await drawingRef.current.saveToLocal()
            }}>save</button>
            <button className='button' onClick={async () => {
              await drawingRef.current.loadFromLocal()
            }}>load</button> */}
            <button className='button' onClick={() => selectMode()}>select</button>
            <button className='button' onClick={() => selectShape("line")}>line</button>
            <button className='button' onClick={() => selectShape("square")}>square</button>
            <button className='button' onClick={() => selectShape("rectangle")}>rectangle</button>
            <button className='button' onClick={() => selectShape("circle")}>circle</button>
            <button className='button' onClick={() => selectShape("ellipse")}>ellipse</button>
            <button className='button' onClick={() => selectShape("triangle")}>triangle</button>
            <button className='button' onClick={() => selectShape("draw")}>draw</button>
            <button className='button'  onClick={undo}>undo</button>
            <button className='button'  onClick={redo}>redo</button>
          </div>
          <canvas ref={canvasRef} id="canvas"></canvas>

          <button className="menu-toggle-button" onClick={toggleMenu}>
            {/* Menu icon */}
            <div className="menu-icon">
              <div />
              <div />
              <div />
            </div>
          </button>

          {/* Menu */}
          {isMenuOpen && (
            <div className="menu">
                
                <button className="menu-item" onClick={() => {
                  showSaveMenu()
                }}>
                  <img src={diskette_img} alt="transparent" />
                  <div>Save</div>
                </button>
                <button className="menu-item" onClick={async () => {
                  showLoadMenu()
                }}>
                  <img src={folder_img} alt="transparent" />
                  <div>Load</div>
                </button>
                <button className="menu-item" onClick={clear}>
                  <img src={eraser_img} alt="transparent" />
                  <div>Clear</div>
                </button>
            </div>
          )}

        <div className="modal" ref={loadScreenRef}>
          <div className="modal-content">
            <button className="close-btn" onClick={closeLoadScreen}>X</button>
            { 
              loadImages.map((obj, index) => (
                <div key={index}>
                  <img src={`data:image/png;base64,${obj.image}`} onClick={async () => {
                    await drawingRef.current.loadDrawing(obj.id)
                    closeLoadScreen()
                    renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
                  }} alt={`Image ${index}`} />
                </div>
              ))
            }
          </div>
        </div>

        <div className="floating-box" ref={loadMenuRef}>
          <button onClick={async () => {
            await drawingRef.current.loadFromLocal()
            hideLoadMenu()
            renderCanva(canvaContextRef.current, drawingRef.current.getShapes())
          }}>Load From Disk
          </button>
          <button onClick={async () => {
            displayLoadScreen()
            hideLoadMenu()
          }}>Load From Cloud</button>
        </div>

        <div className="floating-box" ref={saveMenuRef}>
          <button onClick={async () => {
            await drawingRef.current.saveToLocal()
            hideSaveMenu()
          }}>Save To Disk
          </button>
          <button onClick={async () => {
            hideSaveMenu()
            showSaveToServerMenu()
          }}>Save To Cloud</button>
        </div>

        <div className="floating-box" ref={saveToServerMenu}>
          <button onClick={() => {
            drawingRef.current.save(canvasRef.current, true)
            hideSaveToServerMenu()
          }}>
            Save as JSON
          </button>
          <button onClick={() => {
            drawingRef.current.save(canvasRef.current, false)
            hideSaveToServerMenu()
          }}>Save as XML</button>
        </div>
      </div>
    </>
  )
}

export default TestApp
