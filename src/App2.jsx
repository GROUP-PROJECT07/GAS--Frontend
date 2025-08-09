import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard2";
import Search from "./Search";
import NewForm from "./NewForm2";
import "./styleshome.css";

const App2 = ({ fullName, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [correspondenceData, setCorrespondenceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Safe localStorage functions
  const getLocalStorageItem = (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
    return null;
  };

  const setLocalStorageItem = (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  };

  // Load saved correspondence data on component mount
  useEffect(() => {
    try {
      const savedData = getLocalStorageItem('correspondenceData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          setCorrespondenceData(parsedData);
          console.log('App2: Loaded correspondence data from localStorage');
        }
      }
    } catch (error) {
      console.error('App2: Error loading correspondence data:', error);
    }
  }, []);

  // Save correspondence data to localStorage whenever it changes
  useEffect(() => {
    if (correspondenceData.length > 0) {
      try {
        setLocalStorageItem('correspondenceData', JSON.stringify(correspondenceData));
        console.log('App2: Saved correspondence data to localStorage');
      } catch (error) {
        console.error('App2: Error saving correspondence data:', error);
      }
    }
  }, [correspondenceData]);

  const addCorrespondence = (newItem) => {
    try {
      // Add unique ID and timestamp if not present
      const itemWithId = {
        ...newItem,
        id: newItem.id || Date.now().toString(),
        createdAt: newItem.createdAt || new Date().toISOString(),
      };
      
      setCorrespondenceData((prev) => [...prev, itemWithId]);
      setActiveTab("dashboard");
      setError(null); // Clear any previous errors
      console.log('App2: Added new correspondence item');
    } catch (error) {
      console.error('App2: Error adding correspondence:', error);
      setError('Failed to add correspondence item');
    }
  };

  const deleteCorrespondence = (id) => {
    try {
      setCorrespondenceData((prev) => prev.filter(item => item.id !== id));
      console.log('App2: Deleted correspondence item:', id);
    } catch (error) {
      console.error('App2: Error deleting correspondence:', error);
      setError('Failed to delete correspondence item');
    }
  };

  const updateCorrespondence = (id, updatedItem) => {
    try {
      setCorrespondenceData((prev) => 
        prev.map(item => item.id === id ? { ...item, ...updatedItem } : item)
      );
      console.log('App2: Updated correspondence item:', id);
    } catch (error) {
      console.error('App2: Error updating correspondence:', error);
      setError('Failed to update correspondence item');
    }
  };

  const handleTabChange = (tab) => {
    try {
      setActiveTab(tab);
      setError(null); // Clear errors when changing tabs
      console.log('App2: Changed tab to:', tab);
    } catch (error) {
      console.error('App2: Error changing tab:', error);
      setError('Failed to change tab');
    }
  };

  const handleLogout = () => {
    try {
      console.log('App2: Logout initiated');
      // Clear any sensitive data from localStorage if needed
      // setLocalStorageItem('correspondenceData', '[]'); // Uncomment if you want to clear data on logout
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('App2: Error during logout:', error);
    }
  };

  const renderTab = () => {
    if (loading) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          fontSize: '16px' 
        }}>
          Loading...
        </div>
      );
    }

    try {
      switch (activeTab) {
        case "dashboard":
          return (
            <Dashboard 
              correspondenceData={correspondenceData}
              onDelete={deleteCorrespondence}
              onUpdate={updateCorrespondence}
            />
          );
        case "search":
          return (
            <Search 
              correspondenceData={correspondenceData}
              onUpdate={updateCorrespondence}
            />
          );
        case "newForm":
          return (
            <NewForm 
              addCorrespondence={addCorrespondence}
              onCancel={() => setActiveTab("dashboard")}
            />
          );
        default:
          return (
            <div style={{ 
              textAlign: 'center', 
              padding: '50px',
              color: '#666' 
            }}>
              Unknown tab: {activeTab}
            </div>
          );
      }
    } catch (error) {
      console.error('App2: Error rendering tab:', error);
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          margin: '20px'
        }}>
          <h3>Error Loading Content</h3>
          <p>There was an error loading the {activeTab} tab.</p>
          <button 
            onClick={() => {
              setError(null);
              setActiveTab("dashboard");
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Return to Dashboard
          </button>
        </div>
      );
    }
  };

  return (
    <div className="main2">
      <Navbar 
        onTabChange={handleTabChange} 
        onLogout={handleLogout}
        activeTab={activeTab}
        fullName={fullName}
      />
      <div className="main">
        <div className="top-content">
          <h1>Government Correspondence System</h1>
          {fullName && <h2>Welcome, {fullName}</h2>}
        </div>
        
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#d32f2f',
            padding: '10px 15px',
            margin: '10px 0',
            borderRadius: '4px',
            border: '1px solid #ffcdd2'
          }}>
            <strong>Error:</strong> {error}
            <button 
              onClick={() => setError(null)}
              style={{
                marginLeft: '10px',
                padding: '2px 8px',
                background: 'transparent',
                border: '1px solid #d32f2f',
                borderRadius: '3px',
                color: '#d32f2f',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ✕
            </button>
          </div>
        )}
        
        {renderTab()}
      </div>
    </div>
  );
};

export default App2;