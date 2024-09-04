import React, { useState } from 'react';
import './toolbar.css';
import { TiPencil } from "react-icons/ti";
import { CiEraser } from "react-icons/ci";
import { IoRemoveOutline } from "react-icons/io5";
import { MdOutlineRectangle } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { IoTextOutline } from "react-icons/io5";
const Toolbar = ({ setColor, brushSize, setBrushSize, setTool, setText, setFontSize, setFontColor, handleUndo, handleRedo }) => {
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
      <TiPencil onClick={() => handleToolSelect('brush')} className= {`btn ${selectedTool === 'brush' ? 'active' : ''}`}/>
      <CiEraser onClick={() => handleToolSelect('eraser')} className={`btn ${selectedTool === 'eraser' ? 'active' : ''}`}/>
      <IoRemoveOutline onClick={() => handleToolSelect('line')} className={`btn ${selectedTool === 'line' ? 'active' : ''}`}/>
      <MdOutlineRectangle  onClick={() => handleToolSelect('rectangle')} className={`btn ${selectedTool === 'rectangle' ? 'active' : ''}`}/>
      <FaRegCircle onClick={() => handleToolSelect('circle')} className={`btn ${selectedTool === 'circle' ? 'active' : ''}`}/>
      <IoTextOutline onClick={() => handleToolSelect('text')} className={`btn ${selectedTool === 'text' ? 'active' : ''}`}/>
      {selectedTool === 'text' && (
        <>
          <label>Font Size: </label>
          <input
            type="number"
            min="8"
            max="72"
            defaultValue="16"
            onChange={(e) => setFontSize(Number(e.target.value))}
            className='input-field'
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
            className='input-field'
          />
        </>
      )}
      <FaUndo onClick={handleUndo} className='btn'/>
      <FaRedo onClick={handleRedo} className='btn'/>
    </div>
  );
};

export default Toolbar;
