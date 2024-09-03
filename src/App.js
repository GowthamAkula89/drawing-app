import React, { useState } from 'react';
import Canvas from './Components/Canvas/canvas';
import Toolbar from './Components/Toolbar/toolbar';
import './App.css';
const App = () => {
 const [color, setColor] = useState('#000000');
 const [brushSize, setBrushSize] = useState(1);
 const [tool, setTool] = useState('brush');
 return (
   <div className="app">
     <Toolbar
       setColor={setColor}
       brushSize={brushSize}
       setBrushSize={setBrushSize}
       setTool={setTool}
     />
     
     <Canvas
       color={color}
       brushSize={brushSize}
       tool={tool}
       className= "canvas-draw"
     />
   </div>
 );
};

export default App;