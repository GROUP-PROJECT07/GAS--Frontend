import React, { useState, useEffect } from "react";
import supabase from "./services/supabaseClient";

const Search = () => {
  const [data, setData] = useState([]); // All correspondence
  const [filteredData, setFilteredData] = useState([]); // Search results
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch correspondence from Supabase
  useEffect(() => {
    const fetchCorrespondence = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("correspondence")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error.message);
        setError("Failed to load correspondence data.");
      } else {
        setData(data || []);
        setFilteredData(data || []);
      }
      setLoading(false);
    };

    fetchCorrespondence();
  }, []);

  const handleSearch = () => {
    const lowerSearch = searchTerm.toLowerCase();
    const result = data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(lowerSearch)
      )
    );
    setFilteredData(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <h2>Search Correspondence</h2>
      <input
        type="text"
        placeholder="Search by ID, Date, Subject, Department, Sender/Recipient, Status"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading correspondence...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Sender</th>
              <th>Recipient</th>
              <th>Subject</th>
              <th>Department</th>
              <th>Status</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.date}</td>
                  <td>{item.sender}</td>
                  <td>{item.recipient}</td>
                  <td>{item.subject}</td>
                  <td>{item.department}</td>
                  <td>{item.status}</td>
                  <td>
                    {item.file_url ? (
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    ) : (
                      "No file"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Search;
