import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
const Canvas = forwardRef(({ color, brushSize, tool, text, fontSize, fontColor }, ref) => {
  const canvasRef = useRef(null);
  const contextRef = useRef({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [actions, setActions] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useImperativeHandle(ref, () => ({
    undo,
    redo,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    contextRef.current = { context };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      redrawAll();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    socket.on('drawing', ({ x0, y0, x1, y1, color, size, tool, text, fontSize, fontColor }) => {
      addNewAction({ x0, y0, x1, y1, color, size, tool, text, fontSize, fontColor }, false);
    });

    return () => {
      socket.off('drawing');
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    redrawAll();
  }, [tool]);

  useEffect(() => {
    const { context } = contextRef.current || {};
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const addNewAction = (action, emit = true) => {
    setActions((prevActions) => [...prevActions, action]);
    if (emit) {
      socket.emit('drawing', action);
    }
  };

  const drawLine = (x0, y0, x1, y1, color, size) => {
    const { context } = contextRef.current;
    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();
  };

  const eraseLine = (x0, y0, x1, y1, size) => {
    const { context } = contextRef.current;
    if (!context) return;

    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();
    context.globalCompositeOperation = 'source-over';
  };

  const drawShape = (x0, y0, x1, y1, color, size, tool) => {
    const { context } = contextRef.current;
    if (!context) return;

    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();

    switch (tool) {
      case 'line':
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        break;
      case 'rectangle':
        context.rect(x0, y0, x1 - x0, y1 - y0);
        break;
      case 'circle':
        const radius = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
        context.arc(x0, y0, radius, 0, 2 * Math.PI);
        break;
      default:
        break;
    }

    context.stroke();
    context.closePath();
  };

  const drawText = (x, y, text, fontSize, fontColor) => {
    const { context } = contextRef.current;
    if (!context) return;

    context.font = `${fontSize}px Arial`;
    context.fillStyle = fontColor;
    context.fillText(text, x, y);
  };

  const redrawAll = () => {
    const { context } = contextRef.current;
    if (!context) return;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    actions.forEach(action => {
      const { x0, y0, x1, y1, color, size, tool, text, fontSize, fontColor } = action;
      if (tool === 'text') {
        drawText(x0, y0, text, fontSize, fontColor);
      } else if (tool === 'brush') {
        drawLine(x0, y0, x1, y1, color, size);
      } else if (tool === 'eraser') {
        eraseLine(x0, y0, x1, y1, size);
      } else {
        drawShape(x0, y0, x1, y1, color, size, tool);
      }
    });
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);

    if (tool === 'brush' || tool === 'eraser') {
      const { context } = contextRef.current;
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      contextRef.current.lastX = offsetX;
      contextRef.current.lastY = offsetY;
    } else if (tool === 'text') {
      addNewAction({ x0: offsetX, y0: offsetY, text, fontSize, fontColor, tool: 'text' });
      drawText(offsetX, offsetY, text, fontSize, fontColor);
    } else {
      setStartPos({ x: offsetX, y: offsetY });
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;

    if (tool === 'brush') {
      drawLine(contextRef.current.lastX, contextRef.current.lastY, offsetX, offsetY, color, brushSize);
      addNewAction({ x0: contextRef.current.lastX, y0: contextRef.current.lastY, x1: offsetX, y1: offsetY, color, size: brushSize, tool: 'brush' });
      contextRef.current.lastX = offsetX;
      contextRef.current.lastY = offsetY;
    } else if (tool === 'eraser') {
      eraseLine(contextRef.current.lastX, contextRef.current.lastY, offsetX, offsetY, brushSize);
      addNewAction({ x0: contextRef.current.lastX, y0: contextRef.current.lastY, x1: offsetX, y1: offsetY, size: brushSize, tool: 'eraser' });
      contextRef.current.lastX = offsetX;
      contextRef.current.lastY = offsetY;
    } else {
      redrawAll();
      drawShape(startPos.x, startPos.y, offsetX, offsetY, color, brushSize, tool);
    }
  };

  const finishDrawing = ({ nativeEvent }) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (tool === 'brush' || tool === 'eraser') {
      contextRef.current.context.closePath();
    } else {
      const { offsetX, offsetY } = nativeEvent;
      addNewAction({ x0: startPos.x, y0: startPos.y, x1: offsetX, y1: offsetY, color, size: brushSize, tool });
      drawShape(startPos.x, startPos.y, offsetX, offsetY, color, brushSize, tool);
    }

    saveState();
  };

  const saveState = () => {
    const dataURL = canvasRef.current.toDataURL();
    setHistory(prevHistory => [...prevHistory, dataURL]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setRedoStack(prevRedoStack => [canvasRef.current.toDataURL(), ...prevRedoStack]);

    const { context } = contextRef.current;
    const img = new Image();
    img.src = lastState;
    img.onload = () => {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(img, 0, 0);
    };

    setHistory(newHistory);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[0];
    const newRedoStack = redoStack.slice(1);
    setHistory(prevHistory => [...prevHistory, canvasRef.current.toDataURL()]);

    const { context } = contextRef.current;
    const img = new Image();
    img.src = nextState;
    img.onload = () => {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(img, 0, 0);
    };

    setRedoStack(newRedoStack);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0 }}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseOut={finishDrawing}
    />
  );
});
export default Canvas;