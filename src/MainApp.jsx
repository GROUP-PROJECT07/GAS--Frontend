import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import supabase from "./services/supabaseClient";
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
        </div>
      );
    }
    return this.props.children;
  }
}

function NotFound() {
  return <h2>404 - Page Not Found</h2>;
}

function MainApp() {
  const [debug, setDebug] = useState("Starting MainApp...");
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);

  useEffect(() => {
    async function checkSupabaseSession() {
      try {
        setDebug("Checking Supabase session...");
        const { data, error } = await supabase.auth.getSession();
        setDebug(`Session check complete. Error: ${error ? error.message : "none"}`);
        setSupabaseLoaded(true);
      } catch (err) {
        setDebug(`Session error: ${err.message}`);
      }
    }
    checkSupabaseSession();
  }, []);

  return (
    <ErrorBoundary>
      <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f0", padding: 20 }}>
        <div style={{ backgroundColor: "white", padding: 20, marginBottom: 20, border: "2px solid green" }}>
          <h1>DEBUG INFO</h1>
          <p><strong>Status:</strong> {debug}</p>
          <p><strong>Supabase Loaded:</strong> {supabaseLoaded ? "Yes" : "No"}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>React Version:</strong> {React.version}</p>
          <p><strong>Current Time:</strong> {new Date().toISOString()}</p>
        </div>

        <Router>
          <Routes>
            <Route path="/" element={<AuthForm />} />
            <Route path="/app" element={<Dashboard2 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default MainApp;
