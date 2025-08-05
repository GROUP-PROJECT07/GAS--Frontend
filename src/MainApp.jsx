// MainApp.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import supabase from "./services/supabaseClient";
import AuthForm from "./AuthForm";
import App2 from "./App2";
import Dashboard2 from "./Dashboard2";
import NewForm2 from "./NewForm2";
import Search from "./Search"; // ✅ Added search route

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/" />;
}

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFullName, setUserFullName] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setUserFullName(data.session.user.user_metadata?.full_name || "User");
      }
    };

    checkSession();

    // Listen for auth changes
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

  return (
    <Router>
      <Routes>
        {/* Login Route */}
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

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <App2 fullName={userFullName} onLogout={handleLogout}>
                <Dashboard2 />
              </App2>
            </ProtectedRoute>
          }
        />

        {/* Search Route */}
        <Route
          path="/search"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <App2 fullName={userFullName} onLogout={handleLogout}>
                <Search />
              </App2>
            </ProtectedRoute>
          }
        />

        {/* New Correspondence Route */}
        <Route
          path="/new"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <App2 fullName={userFullName} onLogout={handleLogout}>
                <NewForm2 />
              </App2>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default MainApp;
