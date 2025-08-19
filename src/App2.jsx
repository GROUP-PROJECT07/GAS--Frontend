import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard2";
import Search from "./Search";
import NewForm from "./NewForm2";
import Supabase from "./supabase2"; 
import "./styleshome.css";

const App2 = ({ fullName, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [correspondenceData, setCorrespondenceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await Supabase
        .from("correspondence")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching correspondence:", error);
        setError(error.message);
      } else {
        setCorrespondenceData(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // ✅ Add new correspondence
  const addCorrespondence = async (newItem) => {
    const { data, error } = await Supabase
      .from("correspondence")
      .insert([newItem])
      .select();

    if (error) {
      console.error("Error adding correspondence:", error);
      setError("Failed to add correspondence");
    } else {
      setCorrespondenceData((prev) => [...data, ...prev]);
      setActiveTab("dashboard");
    }
  };

  // ✅ Delete correspondence
  const deleteCorrespondence = async (id) => {
    const { error } = await Supabase
      .from("correspondence")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting correspondence:", error);
      setError("Failed to delete correspondence");
    } else {
      setCorrespondenceData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // ✅ Update correspondence
  const updateCorrespondence = async (id, updatedItem) => {
    const { data, error } = await Supabase
      .from("correspondence")
      .update(updatedItem)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating correspondence:", error);
      setError("Failed to update correspondence");
    } else {
      setCorrespondenceData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data[0] } : item))
      );
    }
  };

  const renderTab = () => {
    if (loading) {
      return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
    }

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
        return <Search correspondenceData={correspondenceData} onUpdate={updateCorrespondence} />;
      case "newForm":
        return <NewForm addCorrespondence={addCorrespondence} onCancel={() => setActiveTab("dashboard")} />;
      default:
        return <div>Unknown tab: {activeTab}</div>;
    }
  };

  return (
    <div className="main2">
      <Navbar onTabChange={setActiveTab} onLogout={onLogout} activeTab={activeTab} fullName={fullName} />
      <div className="main">
        <div className="top-content">
          <h1>Government Correspondence System</h1>
          {fullName && <h2>Welcome, {fullName}</h2>}
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {renderTab()}
      </div>
    </div>
  );
};

export default App2;

