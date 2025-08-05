import React, { useState, useEffect } from 'react';
import supabase from './services/supabaseClient';
import Navbar from './Navbar'; // Adjust import path as needed

const App2 = ({ fullName, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [correspondenceData, setCorrespondenceData] = useState([]);

  // Fetch correspondence when dashboard tab is active
  useEffect(() => {
    if (activeTab === "dashboard") {
      const fetchCorrespondence = async () => {
        try {
          const { data, error } = await supabase
            .from("correspondence")
            .select("*")
            .order("created_at", { ascending: false });
          
          if (error) {
            console.error("Error fetching correspondence:", error);
          } else {
            setCorrespondenceData(data || []);
          }
        } catch (err) {
          console.error("Failed to fetch correspondence:", err);
        }
      };
      fetchCorrespondence();
    }
  }, [activeTab]);

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-content">
            <h3>Dashboard</h3>
            {correspondenceData.length > 0 ? (
              <div className="correspondence-list">
                {correspondenceData.map((item, index) => (
                  <div key={item.id || index} className="correspondence-item">
                    {/* Render your correspondence data here */}
                    <p>{item.title || 'Correspondence Item'}</p>
                    <small>{new Date(item.created_at).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p>No correspondence found.</p>
            )}
          </div>
        );
      
      case "create":
        return (
          <div className="create-content">
            <h3>Create New Correspondence</h3>
            {/* Add your create form here */}
            <p>Create form will go here</p>
          </div>
        );
      
      case "settings":
        return (
          <div className="settings-content">
            <h3>Settings</h3>
            {/* Add your settings content here */}
            <p>Settings content will go here</p>
          </div>
        );
      
      default:
        return (
          <div className="default-content">
            <h3>Welcome to Correspondence System</h3>
            <p>Select a tab to get started.</p>
          </div>
        );
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
        
        {/* Render content based on active tab */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default App2;
