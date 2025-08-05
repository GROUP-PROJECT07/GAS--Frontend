import React from "react";
import Navbar from "./Navbar";
import "./styleshome.css";

const App2 = ({ fullName, onLogout, children }) => {
  return (
    <div className="main2">
      <Navbar onLogout={onLogout} />
      <div className="main">
        <div className="top-content">
          <h1>Correspondence System</h1>
          <h2>{fullName}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default App2;
