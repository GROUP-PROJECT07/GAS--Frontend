import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard2";
import Search from "./Search";
import NewForm from "./NewForm2";
import supabase from "./services/supabaseClient";
import "./styleshome.css";

const App2 = ({ fullName, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [correspondenceData, setCorrespondenceData] = useState([]);

  //  Fetch correspondence when dashboard tab is active
  useEffect(() => {
    if (activeTab === "dashboard") {
      const fetchCorrespondence = async () => {
        const { data, error } = await supabase
          .from("correspondence")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) console.error("Error fetching correspondence:", error);
        else setCorrespondenceData(data || []);
      };

      fetchCorrespondence();
    }
  }, [activeTab]);

  //  Add new correspondence (insert into Supabase)
  const addCorrespondence = async (newItem) => {
    const { data, error } = await supabase
      .from("correspondence")
      .insert([newItem])
      .select();

    if (error) {
      console.error("Error adding correspondence:", error);
    } else {
      setCorrespondenceData((prev) => [data[0], ...prev]);
      setActiveTab("dashboard");
    }
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

export default App2;
