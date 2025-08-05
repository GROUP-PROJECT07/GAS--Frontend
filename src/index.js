import React from 'react';
import ReactDOM from 'react-dom/client';

// Add global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  console.error('Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Test basic functionality first
console.log('index.js: Starting application...');
console.log('index.js: React version:', React.version);

try {
  // Try to import CSS
  console.log('index.js: Importing CSS...');
  import('./styleshome.css').catch(err => {
    console.warn('index.js: CSS import failed:', err);
  });
  
  // Import components
  console.log('index.js: Importing components...');
  
  const startApp = async () => {
    try {
      // Dynamic imports to catch errors
      const { default: MainApp } = await import('./MainApp');
      const { default: reportWebVitals } = await import('./reportWebVitals');
      
      console.log('index.js: Components imported successfully');
      console.log('index.js: Getting root element...');
      
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        throw new Error('Root element not found');
      }
      
      console.log('index.js: Creating React root...');
      const root = ReactDOM.createRoot(rootElement);
      
      console.log('index.js: Rendering app...');
      root.render(
        <React.StrictMode>
          <MainApp />
        </React.StrictMode>
      );
      
      console.log('index.js: App rendered successfully');
      
      // Start web vitals
      reportWebVitals();
      
    } catch (error) {
      console.error('index.js: Error during app startup:', error);
      
      // Render error directly to DOM if React fails
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
            <h1>Application Startup Error</h1>
            <p>The application failed to start properly.</p>
            <details style="margin-top: 20px; padding: 10px; background: white; border-radius: 4px;">
              <summary>Error Details</summary>
              <pre style="white-space: pre-wrap; font-size: 12px;">${error.toString()}</pre>
              <pre style="white-space: pre-wrap; font-size: 12px;">${error.stack || 'No stack trace'}</pre>
            </details>
            <button onclick="window.location.reload()" style="
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #1976d2;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">Reload Page</button>
          </div>
        `;
      }
    }
  };
  
  startApp();
  
} catch (error) {
  console.error('index.js: Critical error:', error);
}
