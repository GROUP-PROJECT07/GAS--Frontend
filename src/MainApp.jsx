// MainApp.jsx
import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"; //  Use HashRouter for Vercel
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

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("Session error:", error);

        if (data?.session) {
          setIsAuthenticated(true);
          setUserFullName(data.session.user.user_metadata?.full_name || "User");
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false); //  Ensure loading state is cleared
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserFullName(session.user.user_metadata?.full_name || "User");
      } else {
        setIsAuthenticated(false);
        setUserFullName("");
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserFullName("");
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/app" />
            ) : (
              <AuthForm
                onLoginSuccess={(name) => {
                  setUserFullName(name);
                  setIsAuthenticated(true);
                }}
              />
            )
          }
        />

        {/* Main App */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <App2 fullName={userFullName} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default MainApp;
