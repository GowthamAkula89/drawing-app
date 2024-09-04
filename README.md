# Drawing Application
## Overview
- This project is a real-time collaborative canvas drawing application built with React and Socket.IO. It allows multiple users to simultaneously draw, erase, and add text on a shared canvas. The application includes features such as undo/redo, various drawing tools (brush, eraser, shapes), and text support.

### Features
- Real-time collaboration with multiple users
- Drawing tools: brush, eraser, line, rectangle, circle
- Text addition with customizable font size and color
- Undo/Redo functionality
- Responsive canvas that adjusts to window size changes

### Tech Stack
- React: A JavaScript library for building user interfaces. It is used for its component-based architecture, making it easy to manage state and build interactive UIs.
- Socket.IO: A library for real-time web applications. It enables real-time, bidirectional communication between clients and servers, crucial for the collaborative features of the application.
- HTML5 Canvas: Provides the drawing surface for the application, allowing for complex graphics operations.
### Justification
- React: Chosen for its ability to efficiently update and render UI components, manage state, and handle complex interactions in a modular way.
- Socket.IO: Selected for its simplicity in implementing real-time communication, essential for collaborative features.
- HTML5 Canvas: The ideal choice for drawing operations due to its flexibility and performance.

## Setup and Installation
### Prerequisites
- Node.js
- npm or yarn
- Installation
- Clone the Repository: git clone https://github.com/GowthamAkula89/drawing-app/
- cd drawing-app
### Install Dependencies:
- npm install
- Start the Development Server: npm start
- Visit the Application: Open your browser and go to http://localhost:3000.

## Usage
1. Drawing:
  - Select a tool (brush, eraser, shape) from the toolbar.
  - Draw on the canvas using mouse or touch input.
  - For text, select the text tool and input your text on the canvas.
2. Undo/Redo:
  - Use the provided undo/redo buttons to navigate through drawing actions.

## Deployment
Hosting
The application has been successfully deployed to a vercel.
To visit: 
