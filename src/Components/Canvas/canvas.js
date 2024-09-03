import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Canvas = ({ color, brushSize, tool }) => {
  const canvasRef = useRef(null);
  const brushRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const brushCanvas = brushRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      brushCanvas.width = canvas.width;
      brushCanvas.height = canvas.height;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      brushCanvas.style.width = `${window.innerWidth}px`;
      brushCanvas.style.height = `${window.innerHeight}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const canvas = canvasRef.current;
    const brushCanvas = brushRef.current;
    
    const context = canvas.getContext('2d');
    const brushContext = brushCanvas.getContext('2d');
    
    contextRef.current = { context, brushContext };

    socket.on('drawing', ({ x0, y0, x1, y1, color, size, tool }) => {
      if (tool === 'eraser') {
        eraseLine(x0, y0, x1, y1, size, false);
      } else {
        drawShape(x0, y0, x1, y1, color, size, tool, false);
      }
    });

    return () => {
      socket.off('drawing');
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const { brushContext } = contextRef.current;
    if (brushContext) {
      brushContext.strokeStyle = color;
      brushContext.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const drawLine = (x0, y0, x1, y1, color, size, emit) => {
    const { brushContext } = contextRef.current;
    brushContext.strokeStyle = color;
    brushContext.lineWidth = size;
    brushContext.beginPath();
    brushContext.moveTo(x0, y0);
    brushContext.lineTo(x1, y1);
    brushContext.stroke();
    brushContext.closePath();

    if (emit) {
      socket.emit('drawing', { x0, y0, x1, y1, color, size });
    }
  };

  const eraseLine = (x0, y0, x1, y1, size, emit) => {
    const { brushContext } = contextRef.current;
    brushContext.globalCompositeOperation = 'destination-out';
    brushContext.lineWidth = size;
    brushContext.beginPath();
    brushContext.moveTo(x0, y0);
    brushContext.lineTo(x1, y1);
    brushContext.stroke();
    brushContext.closePath();
    brushContext.globalCompositeOperation = 'source-over';

    if (emit) {
      socket.emit('drawing', { x0, y0, x1, y1, size, tool: 'eraser' });
    }
  };

  const drawShape = (x0, y0, x1, y1, color, size, tool, emit) => {
    const { context } = contextRef.current;
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

    if (emit) {
      socket.emit('drawing', { x0, y0, x1, y1, color, size, tool });
    }
  };

  const redrawShapes = () => {
    const { context } = contextRef.current;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    shapes.forEach(shape => {
      drawShape(shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.size, shape.tool, false);
    });
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);

    if (tool === 'brush' || tool === 'eraser') {
      const { brushContext } = contextRef.current;
      brushContext.beginPath();
      brushContext.moveTo(offsetX, offsetY);
      brushContext.lastX = offsetX;
      brushContext.lastY = offsetY;
    } else {
      setStartPos({ x: offsetX, y: offsetY });
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;

    if (tool === 'brush') {
      drawLine(contextRef.current.brushContext.lastX, contextRef.current.brushContext.lastY, offsetX, offsetY, color, brushSize, true);
    } else if (tool === 'eraser') {
      eraseLine(contextRef.current.brushContext.lastX, contextRef.current.brushContext.lastY, offsetX, offsetY, brushSize, true);
    } else {
      redrawShapes();
      drawShape(startPos.x, startPos.y, offsetX, offsetY, color, brushSize, tool, false);
    }

    contextRef.current.brushContext.lastX = offsetX;
    contextRef.current.brushContext.lastY = offsetY;
  };

  const finishDrawing = ({ nativeEvent }) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (tool === 'brush' || tool === 'eraser') {
      contextRef.current.brushContext.closePath();
    } else {
      const { offsetX, offsetY } = nativeEvent;
      const newShape = { x0: startPos.x, y0: startPos.y, x1: offsetX, y1: offsetY, color, size: brushSize, tool };
      setShapes([...shapes, newShape]);
      drawShape(startPos.x, startPos.y, offsetX, offsetY, color, brushSize, tool, true);
    }
  };

  return (
    <div>
      <canvas
        ref={brushRef}
        style={{ position: 'absolute', top: 0, left: 0 }}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseOut={finishDrawing}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0 }}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseOut={finishDrawing}
      />
    </div>
  );
};

export default Canvas;
