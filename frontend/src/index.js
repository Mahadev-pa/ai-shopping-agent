// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #ffffff;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #fbbf24;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #f59e0b;
  }
  
  input[type="range"] {
    -webkit-appearance: none;
    background: #e2e8f0;
    border-radius: 10px;
    height: 6px;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #f59e0b;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    background: #d97706;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);