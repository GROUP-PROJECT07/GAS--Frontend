import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import supabase from "./services/supabaseClient";
import AuthForm from "./AuthForm";
import App2 from "./App2";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          color: 'red',
          backgroundColor: '#fff',
          minHeight: '100vh'
        }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/" />;
}

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userFullName, setUserFullName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('MainApp mounted, checking session...');
    
    const checkSession = async () => {
      try {
        // Add a check to ensure supabase is properly initialized
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        console.log('Fetching session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setError(error.message);
          return;
        }

        console.log('Session data:', data);

        if (data?.session) {
          setIsAuthenticated(true);
          setUserFullName(data.session.user.user_metadata?.full_name || "User");
          console.log('User authenticated:', data.session.user.email);
        } else {
          console.log('No active session found');
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log('Session check complete');
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      
      if (session) {
        setIsAuthenticated(true);
        setUserFullName(session.user.user_metadata?.full_name || "User");
      } else {
        setIsAuthenticated(false);
        setUserFullName("");
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      setUserFullName("");
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Show error state
  if (error) {
    return (
      <div style={{ 
        textAlign: "center", 
        marginTop: "50px",
        padding: "20px",
        color: "red"
      }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reload Page
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

  console.log('Rendering MainApp, isAuthenticated:', isAuthenticated);

  return (
    <ErrorBoundary>
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
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
                      console.log('Login success:', name);
                      setUserFullName(name);
                      setIsAuthenticated(true);
                    }}
                  />
                )
              }
            />

            {/* Main App Route */}
            <Route
              path="/app/*"
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
    </ErrorBoundary>
  );
}

export default MainApp;
