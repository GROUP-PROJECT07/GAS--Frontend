// MainApp.jsx
import React, { useState } from "react";
import AuthForm from "./AuthForm";
import App2 from "./App2";

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
  return localStorage.getItem("auth") === "true";
});
const [userFullName, setUserFullName] = useState(() => {
  return localStorage.getItem("userFullName") || "";
});

  const handleLogout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("userFullName");
  setIsAuthenticated(false);
};

  return (
    <>
      {isAuthenticated ? (
        <App2 fullName={userFullName} onLogout={handleLogout}/>
      ) : (
        <AuthForm onLoginSuccess={(name) => {
  setUserFullName(name);
  setIsAuthenticated(true);
}} />
      )}
    </>
  );
}

export default MainApp;
