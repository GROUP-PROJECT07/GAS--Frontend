import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Minimal test component to verify basic rendering
function TestComponent() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'lightblue', 
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>TEST COMPONENT WORKING</h1>
      <p>If you see this, React is rendering correctly</p>
      <p>Current URL: {window.location.href}</p>
      <p>Current Hash: {window.location.hash}</p>
    </div>
  );
}

// Error boundary to catch any rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary Caught:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'red', 
          color: 'white',
          minHeight: '100vh'
        }}>
          <h2>Something went wrong!</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function MainApp() {
  const [debug, setDebug] = useState('Starting MainApp...');
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);

  useEffect(() => {
    console.log('MainApp useEffect triggered');
    setDebug('MainApp useEffect running...');
    
    // Test if we can import supabase
    const testSupabase = async () => {
      try {
        setDebug('Attempting to import supabase...');
        
        // Dynamic import to catch import errors
        const { default: supabase } = await import('./services/supabaseClient');
        
        if (supabase) {
          setDebug('Supabase imported successfully');
          setSupabaseLoaded(true);
          
          // Test basic supabase functionality
          try {
            const { data, error } = await supabase.auth.getSession();
            setDebug(`Session check complete. Error: ${error ? error.message : 'none'}`);
          } catch (sessionError) {
            setDebug(`Session error: ${sessionError.message}`);
          }
        } else {
          setDebug('Supabase import returned null/undefined');
        }
      } catch (importError) {
        console.error('Supabase import error:', importError);
        setDebug(`Supabase import failed: ${importError.message}`);
      }
    };

    testSupabase();
  }, []);

  console.log('MainApp render, debug:', debug);

  return (
    <ErrorBoundary>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f0f0f0',
        padding: '20px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          marginBottom: '20px',
          border: '2px solid green'
        }}>
          <h1>DEBUG INFO</h1>
          <p><strong>Status:</strong> {debug}</p>
          <p><strong>Supabase Loaded:</strong> {supabaseLoaded ? 'Yes' : 'No'}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>React Version:</strong> {React.version}</p>
          <p><strong>Current Time:</strong> {new Date().toISOString()}</p>
        </div>

        <Router>
          <Routes>
            <Route path="/" element={<TestComponent />} />
            <Route path="/app" element={<TestComponent />} />
            <Route path="*" element={<TestComponent />} />
          </Routes>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default MainApp;
