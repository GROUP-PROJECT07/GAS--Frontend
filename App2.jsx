import React, { useState } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard2";
import Search from "./Search";
import NewForm from "./NewForm2";
import "./styleshome.css";

const App2 = ({ fullName, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [correspondenceData, setCorrespondenceData] = useState([]);

  // Add new correspondence to the dashboard
  const addCorrespondence = (newItem) => {
    setCorrespondenceData((prev) => [...prev, newItem]);
    setActiveTab("dashboard"); // Switch to dashboard after adding
  };

  // Render the active tab's component
  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard correspondenceData={correspondenceData} />;
      case "search":
        return <Search />;
      case "newForm":
        return <NewForm addCorrespondence={addCorrespondence} />;
      default:
        return null;
    }
  };

  return (
    <div className="main2">
      {/* Pass tab switch handler and logout to navbar */}
      <Navbar onTabChange={setActiveTab} onLogout={onLogout} />
      <div className="main">
        <div className="top-content">
          <h1>Correspondence System</h1>
          <h2>{fullName}</h2>
        </div>
        {renderTab()}
      </div>
    </div>
  );
};

export default App2;
