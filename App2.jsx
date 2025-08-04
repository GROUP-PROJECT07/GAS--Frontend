import React, { useState } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard2";
import Search from "./Search";
import NewForm from "./NewForm2";

import "./styleshome.css";

const App = ({fullName, onLogout}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [correspondenceData, setCorrespondenceData] = useState([]);

  const addCorrespondence = (newItem) => {
    setCorrespondenceData((prev) => [...prev, newItem]);
    setActiveTab("dashboard"); 
  };

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

export default App;

