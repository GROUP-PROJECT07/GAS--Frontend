// MainApp.jsx
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

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Session:", data.session);
      if (data.session) {
        setIsAuthenticated(true);
        setUserFullName(data.session.user.user_metadata?.full_name || "User");
      }
      setLoading(false);
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
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserFullName("");
    setIsAuthenticated(false);
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
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
        <Route
          path="/*"
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
