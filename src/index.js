import React from 'react';
import ReactDOM from 'react-dom/client';
import './styleshome.css';
import MainApp from './MainApp';
import reportWebVitals from './reportWebVitals';

// Add global error handlers for debugging
window.addEventListener('error', (event) => {
  console.error(' Global JavaScript Error:', event.error);
  console.error('Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error(' Unhandled Promise Rejection:', event.reason);
});

console.log(' Starting application...');
console.log(' React version:', React.version);
console.log(' Environment:', process.env.NODE_ENV);

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element #root not found in DOM');
  }

  console.log(' Root element found');
  console.log(' Creating React root...');
  
  const root = ReactDOM.createRoot(rootElement);
  
  console.log(' Rendering MainApp...');
  
  root.render(
    <React.StrictMode>
      <MainApp />
    </React.StrictMode>
  );
  
  console.log(' MainApp rendered successfully');
  
  // Start web vitals
  reportWebVitals();
  
} catch (error) {
  console.error(' Critical error in index.js:', error);
  
  // Show error on page if React completely fails
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        padding: 20px; 
        background-color: #ffebee; 
        color: #c62828; 
        font-family: Arial, sans-serif;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <h1> Critical Application Error</h1>
        <p>The application failed to start.</p>
        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 4px; max-width: 80%; overflow: auto;">
          <strong>Error:</strong><br>
          <pre style="white-space: pre-wrap; font-size: 12px; color: #d32f2f;">${error.toString()}</pre>
          ${error.stack ? `<br><strong>Stack:</strong><br><pre style="white-space: pre-wrap; font-size: 10px; color: #666;">${error.stack}</pre>` : ''}
        </div>
        <button onclick="window.location.reload()" style="
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        ">🔄 Reload Page</button>
      </div>
    `;
  }
}
