import React, { useState } from 'react';
import './toolbar.css';

const Toolbar = ({ setColor, brushSize, setBrushSize, setTool }) => {
  const [selectedTool, setSelectedTool] = useState('brush');

  const handleToolSelect = (tool) => {
    console.log("tool", tool)
    setSelectedTool(tool);
    setTool(tool);
  };

  return (
    <div className="toolbar">
      <label>Brush Color: </label>
      <input
        type="color"
        onChange={(e) => setColor(e.target.value)}
        title="Select Color"
      />
      <label>Brush Size: </label>
      <input
        type="range"
        min="1"
        max="50"
        value={brushSize}
        onChange={(e) => setBrushSize(Number(e.target.value))}
        title="Brush Size"
      />
      <button onClick={() => handleToolSelect('brush')} className={selectedTool === 'brush' ? 'active' : ''}>Brush</button>
      <button onClick={() => handleToolSelect('eraser')} className={selectedTool === 'eraser' ? 'active' : ''}>Eraser</button>
      <button onClick={() => handleToolSelect('line')} className={selectedTool === 'line' ? 'active' : ''}>Line</button>
      <button onClick={() => handleToolSelect('rectangle')} className={selectedTool === 'rectangle' ? 'active' : ''}>Rectangle</button>
      <button onClick={() => handleToolSelect('circle')} className={selectedTool === 'circle' ? 'active' : ''}>Circle</button>
      <button onClick={() => handleToolSelect('polygon')} className={selectedTool === 'polygon' ? 'active' : ''}>Polygon</button>
    </div>
  );
};

export default Toolbar;
