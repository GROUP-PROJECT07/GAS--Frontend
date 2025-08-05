import React from 'react';
import ReactDOM from 'react-dom/client';
import './styleshome.css';
import MainApp from './MainApp';
import reportWebVitals from './reportWebVitals';

// Remove the unused supabase import - this could be causing the blank page
// import supabase from "./services/supabaseClient";

const root = ReactDOM.createRoot(document.getElementById('root'));

// Add error boundary at the root level
class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Root Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1>Application Error</h1>
          <p>The application failed to load properly.</p>
          <details style={{ 
            marginTop: '20px', 
            padding: '10px', 
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            maxWidth: '80%',
            overflow: 'auto'
          }}>
            <summary>Error Details</summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

root.render(
  <React.StrictMode>
    <RootErrorBoundary>
      <MainApp />
    </RootErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();
