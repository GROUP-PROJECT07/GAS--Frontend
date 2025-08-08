import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import supabase from "./services/supabaseClient";
import AuthForm from "./AuthForm";
import App2 from "./App2";

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/" />;
}

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userFullName, setUserFullName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('MainApp: Starting session check...');
    
    const checkSession = async () => {
      try {
        console.log('MainApp: Fetching session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("MainApp: Session error:", error);
          setError(`Authentication error: ${error.message}`);
          return;
        }

        console.log('MainApp: Session data received:', !!data?.session);

        if (data?.session) {
          setIsAuthenticated(true);
          setUserFullName(data.session.user.user_metadata?.full_name || "User");
          console.log('MainApp: User authenticated:', data.session.user.email);
        } else {
          console.log('MainApp: No active session found');
        }
      } catch (err) {
        console.error("MainApp: Failed to fetch session:", err);
        setError(`Failed to initialize authentication: ${err.message}`);
      } finally {
        setLoading(false);
        console.log('MainApp: Session check complete');
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('MainApp: Auth state changed:', _event, session?.user?.email);
      
      if (session) {
        setIsAuthenticated(true);
        setUserFullName(session.user.user_metadata?.full_name || "User");
        setError(null); // Clear any previous errors
      } else {
        setIsAuthenticated(false);
        setUserFullName("");
      }
    });

    return () => {
      console.log('MainApp: Cleaning up auth listener');
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log('MainApp: Logging out...');
      await supabase.auth.signOut();
      setUserFullName("");
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('MainApp: Logout error:', err);
      setError(`Logout failed: ${err.message}`);
    }
  };

  // Show error state
  if (error) {
    return (
      <div style={{ 
        textAlign: "center", 
        marginTop: "50px",
        padding: "20px",
        backgroundColor: "#ffebee",
        color: "#c62828",
        minHeight: "100vh"
      }}>
        <h2>Application Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => {
            setError(null);
            window.location.reload();
          }}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        textAlign: "center", 
        marginTop: "50px",
        backgroundColor: "#fff",
        minHeight: "100vh",
        padding: "20px"
      }}>
        <h2>Loading...</h2>
        <p>Initializing application...</p>
      </div>
    );
  }

  console.log('MainApp: Rendering routes, isAuthenticated:', isAuthenticated);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/app" replace />
              ) : (
                <AuthForm
                  onLoginSuccess={(name) => {
                    console.log('MainApp: Login success:', name);
                    setUserFullName(name);
                    setIsAuthenticated(true);
                  }}
                />
              )
            }
          />

          {/* Main App Route */}
          <Route
            path="/app"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <App2 fullName={userFullName} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default MainApp;


