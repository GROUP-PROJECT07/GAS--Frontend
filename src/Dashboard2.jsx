import React, { useEffect, useState } from "react";
import supabase from "./services/supabaseClient";

const Dashboard = ({ correspondenceData = [], onDelete, onUpdate }) => {
  const [supabaseData, setSupabaseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");

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

  useEffect(() => {
    fetchCorrespondence();
  }, []);

  const fetchCorrespondence = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Dashboard: Fetching correspondence from Supabase...');
      const { data, error } = await supabase
        .from("correspondence")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Dashboard: Error fetching correspondence:", error);
        setError(`Failed to fetch data: ${error.message}`);
      } else {
        console.log('Dashboard: Successfully fetched', data?.length || 0, 'items');
        setSupabaseData(data || []);
      }
    } catch (err) {
      console.error("Dashboard: Network error:", err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Combine Supabase data and local data
  const getAllCorrespondence = () => {
    const combined = [...supabaseData, ...correspondenceData];
    
    // Remove duplicates based on ID
    const unique = combined.reduce((acc, current) => {
      const existingIndex = acc.findIndex(item => item.id === current.id);
      if (existingIndex === -1) {
        acc.push(current);
      } else {
        // Keep the most recent version (prefer Supabase data)
        if (supabaseData.find(item => item.id === current.id)) {
          acc[existingIndex] = current;
        }
      }
      return acc;
    }, []);

    return unique;
  };

  const filteredAndSortedData = () => {
    let data = getAllCorrespondence();

    // Filter by status
    if (filterStatus !== "all") {
      data = data.filter(item => 
        item.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Sort data
    data.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.date || a.created_at || 0);
          bValue = new Date(b.date || b.created_at || 0);
          break;
        case "sender":
          aValue = (a.sender || "").toLowerCase();
          bValue = (b.sender || "").toLowerCase();
          break;
        case "subject":
          aValue = (a.subject || "").toLowerCase();
          bValue = (b.subject || "").toLowerCase();
          break;
        case "status":
          aValue = (a.status || "").toLowerCase();
          bValue = (b.status || "").toLowerCase();
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return data;
  };

  const displayData = filteredAndSortedData();
  const total = displayData.length;
  const pending = displayData.filter(item => item.status?.toLowerCase() === "pending").length;
  const completed = displayData.filter(item => item.status?.toLowerCase() === "completed").length;
  const inProgress = displayData.filter(item => item.status?.toLowerCase() === "in progress").length;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this correspondence?")) {
      return;
    }

    try {
      // Try to delete from Supabase first
      const supabaseItem = supabaseData.find(item => item.id === id);
      if (supabaseItem) {
        const { error } = await supabase
          .from("correspondence")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Dashboard: Error deleting from Supabase:", error);
          setError(`Failed to delete: ${error.message}`);
          return;
        }
      }

      // Remove from local state
      setSupabaseData(prev => prev.filter(item => item.id !== id));
      
      // Call parent delete function if available
      if (onDelete) {
        onDelete(id);
      }
      
      console.log('Dashboard: Successfully deleted item:', id);
    } catch (err) {
      console.error("Dashboard: Error deleting correspondence:", err);
      setError(`Failed to delete: ${err.message}`);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const supabaseItem = supabaseData.find(item => item.id === id);
      
      if (supabaseItem) {
        const { error } = await supabase
          .from("correspondence")
          .update({ status: newStatus })
          .eq("id", id);

        if (error) {
          console.error("Dashboard: Error updating status:", error);
          setError(`Failed to update status: ${error.message}`);
          return;
        }
      }

      // Update local state
      setSupabaseData(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      // Call parent update function if available
      if (onUpdate) {
        onUpdate(id, { status: newStatus });
      }

      console.log('Dashboard: Successfully updated status for item:', id);
    } catch (err) {
      console.error("Dashboard: Error updating status:", err);
      setError(`Failed to update status: ${err.message}`);
    }
  };

  const handleRefresh = () => {
    fetchCorrespondence();
    setError(null);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "#6b7280";
    
    switch (status.toLowerCase()) {
      case "pending":
        return "#f59e0b";
      case "completed":
        return "#10b981";
      case "in progress":
        return "#3b82f6";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div id="dashboard" className="tab-content active">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "5px 10px",
              border: "1px solid #d1d5db",
              borderRadius: "4px"
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="in progress">In Progress</option>
          </select>
          <button 
            onClick={handleRefresh}
            style={{
              padding: "5px 15px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: "#fef2f2",
          color: "#dc2626",
          padding: "10px 15px",
          margin: "10px 0",
          borderRadius: "4px",
          border: "1px solid #fecaca"
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError(null)}
            style={{
              marginLeft: "10px",
              padding: "2px 8px",
              background: "transparent",
              border: "1px solid #dc2626",
              borderRadius: "3px",
              color: "#dc2626",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="max-w-[85rem] px-4 py-6 sm:px-6 lg:px-8 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-4">
            <p className="text-xs uppercase text-gray-500">Total Correspondence</p>
            <h3 className="mt-1 text-xl sm:text-2xl font-medium text-gray-800">{total}</h3>
          </div>
          <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-4">
            <p className="text-xs uppercase text-gray-500">Pending</p>
            <h3 className="mt-1 text-xl sm:text-2xl font-medium text-yellow-500">{pending}</h3>
          </div>
          <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-4">
            <p className="text-xs uppercase text-gray-500">In Progress</p>
            <h3 className="mt-1 text-xl sm:text-2xl font-medium text-blue-500">{inProgress}</h3>
          </div>
          <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-4">
            <p className="text-xs uppercase text-gray-500">Completed</p>
            <h3 className="mt-1 text-xl sm:text-2xl font-medium text-green-600">{completed}</h3>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          Loading correspondence data...
        </div>
      ) : (
        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                <th 
                  onClick={() => handleSort("id")}
                  style={{ 
                    padding: "12px", 
                    textAlign: "left", 
                    cursor: "pointer",
                    borderBottom: "2px solid #e5e7eb" 
                  }}
                >
                  ID {getSortIcon("id")}
                </th>
                <th 
                  onClick={() => handleSort("date")}
                  style={{ 
                    padding: "12px", 
                    textAlign: "left", 
                    cursor: "pointer",
                    borderBottom: "2px solid #e5e7eb" 
                  }}
                >
                  Date {getSortIcon("date")}
                </th>
                <th 
                  onClick={() => handleSort("sender")}
                  style={{ 
                    padding: "12px", 
                    textAlign: "left", 
                    cursor: "pointer",
                    borderBottom: "2px solid #e5e7eb" 
                  }}
                >
                  Sender {getSortIcon("sender")}
                </th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                  Recipient
                </th>
                <th 
                  onClick={() => handleSort("subject")}
                  style={{ 
                    padding: "12px", 
                    textAlign: "left", 
                    cursor: "pointer",
                    borderBottom: "2px solid #e5e7eb" 
                  }}
                >
                  Subject {getSortIcon("subject")}
                </th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                  Department
                </th>
                <th 
                  onClick={() => handleSort("status")}
                  style={{ 
                    padding: "12px", 
                    textAlign: "left", 
                    cursor: "pointer",
                    borderBottom: "2px solid #e5e7eb" 
                  }}
                >
                  Status {getSortIcon("status")}
                </th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                  Attachment
                </th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ 
                    textAlign: "center", 
                    padding: "50px",
                    color: "#6b7280"
                  }}>
                    {loading ? "Loading..." : "No correspondence data found"}
                  </td>
                </tr>
              ) : (
                displayData.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px" }}>{item.id}</td>
                    <td style={{ padding: "12px" }}>{formatDate(item.date || item.created_at)}</td>
                    <td style={{ padding: "12px" }}>{item.sender || "N/A"}</td>
                    <td style={{ padding: "12px" }}>{item.recipient || "N/A"}</td>
                    <td style={{ padding: "12px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.subject || "N/A"}
                    </td>
                    <td style={{ padding: "12px" }}>{item.department || "N/A"}</td>
                    <td style={{ padding: "12px" }}>
                      <select
                        value={item.status || "pending"}
                        onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          backgroundColor: "white",
                          color: getStatusColor(item.status)
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {item.file_url ? (
                        <a 
                          href={item.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            color: "#3b82f6",
                            textDecoration: "none"
                          }}
                        >
                          📎 View File
                        </a>
                      ) : (
                        <span style={{ color: "#6b7280" }}>No file</span>
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        table th:hover {
          background-color: #f3f4f6 !important;
        }
        
        table tr:hover {
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;