import React, { useState } from 'react';
import Canvas from './Components/Canvas/canvas';
import Toolbar from './Components/Toolbar/toolbar';
import './App.css';

const App = () => {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(1);
  const [tool, setTool] = useState('brush');
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');

  return (
    <div className="app">
      <Toolbar
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        setTool={setTool}
        setText={setText}
        setFontSize={setFontSize}
        setFontColor={setFontColor}
      />
      <Canvas
        color={color}
        brushSize={brushSize}
        tool={tool}
        text={text}
        fontSize={fontSize}
        fontColor={fontColor}
      />
    </div>
  );
};

export default App;
