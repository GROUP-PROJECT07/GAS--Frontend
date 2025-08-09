import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import supabase from "./services/supabaseClient"; // Temporarily commented out
import AuthForm from "./AuthForm";
import Dashboard2 from "./Dashboard2";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, backgroundColor: "red", color: "white", minHeight: "100vh" }}>
          <h2>Something went wrong!</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: 10, padding: 10, fontSize: 16 }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function NotFound() {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

function MainApp() {
  const [debug, setDebug] = useState("Starting MainApp...");
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);
  const [componentErrors, setComponentErrors] = useState([]);

  useEffect(() => {
    console.log("🚀 MainApp useEffect triggered");
    
    // Test basic functionality first
    setDebug("MainApp mounted successfully");
    
    // Temporarily skip Supabase to isolate the issue
    setTimeout(() => {
      setDebug("Skipping Supabase for debugging...");
      setSupabaseLoaded(true);
    }, 1000);

    /* Original Supabase code - temporarily commented out
    async function checkSupabaseSession() {
      try {
        setDebug("Checking Supabase session...");
        console.log("🔍 About to check Supabase session");
        
        const { data, error } = await supabase.auth.getSession();
        
        console.log("📊 Session data:", data);
        console.log("❌ Session error:", error);
        
        setDebug(`Session check complete. Error: ${error ? error.message : "none"}`);
        setSupabaseLoaded(true);
      } catch (err) {
        console.error("🚨 Supabase error:", err);
        setDebug(`Session error: ${err.message}`);
        setComponentErrors(prev => [...prev, `Supabase: ${err.message}`]);
      }
    }
    
    checkSupabaseSession();
    */
  }, []);

  // Test component loading
  const testAuthForm = () => {
    try {
      return <AuthForm />;
    } catch (err) {
      console.error("AuthForm error:", err);
      setComponentErrors(prev => [...prev, `AuthForm: ${err.message}`]);
      return <div style={{color: "red"}}>AuthForm failed to load: {err.message}</div>;
    }
  };

  const testDashboard = () => {
    try {
      return <Dashboard2 />;
    } catch (err) {
      console.error("Dashboard2 error:", err);
      setComponentErrors(prev => [...prev, `Dashboard2: ${err.message}`]);
      return <div style={{color: "red"}}>Dashboard2 failed to load: {err.message}</div>;
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f0", padding: 20 }}>
        <div style={{ backgroundColor: "white", padding: 20, marginBottom: 20, border: "2px solid green" }}>
          <h1>🐛 DEBUG INFO</h1>
          <p><strong>Status:</strong> {debug}</p>
          <p><strong>Supabase Loaded:</strong> {supabaseLoaded ? "✅ Yes" : "⏳ No"}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>React Version:</strong> {React.version}</p>
          <p><strong>Current Time:</strong> {new Date().toISOString()}</p>
          <p><strong>URL Path:</strong> {window.location.pathname}</p>
          
          {componentErrors.length > 0 && (
            <div style={{ backgroundColor: "#ffebee", padding: 10, margin: "10px 0", borderRadius: 4 }}>
              <strong>⚠️ Component Errors:</strong>
              <ul>
                {componentErrors.map((error, index) => (
                  <li key={index} style={{ color: "red" }}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: "white", padding: 20, marginBottom: 20, border: "1px solid blue" }}>
          <h2>🧪 Component Test</h2>
          <p>If you see this section, React Router is working!</p>
        </div>

        <Router>
          <Routes>
            <Route path="/" element={testAuthForm()} />
            <Route path="/app" element={testDashboard()} />
            <Route path="/test" element={
              <div style={{ padding: 20 }}>
                <h2>✅ Test Route Working!</h2>
                <p>This is a simple test route to verify routing works.</p>
              </div>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default MainApp;