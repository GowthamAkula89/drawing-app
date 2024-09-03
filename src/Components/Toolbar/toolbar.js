import React, { useState } from 'react';
import './toolbar.css';

const Toolbar = ({ setColor, brushSize, setBrushSize, setTool, setText, setFontSize, setFontColor }) => {
  const [selectedTool, setSelectedTool] = useState('brush');

  const handleToolSelect = (tool) => {
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
      <button onClick={() => handleToolSelect('text')} className={selectedTool === 'text' ? 'active' : ''}>Text</button>
      {selectedTool === 'text' && (
        <>
          <label>Font Size: </label>
          <input
            type="number"
            min="8"
            max="72"
            defaultValue="16"
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
          <label>Font Color: </label>
          <input
            type="color"
            onChange={(e) => setFontColor(e.target.value)}
            title="Select Font Color"
          />
          <input
            type="text"
            placeholder="Enter text"
            onChange={(e) => setText(e.target.value)}
          />
        </>
      )}
    </div>
  );
};

export default Toolbar;
