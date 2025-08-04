import React, { useState } from "react";

const Search = () => {
  const data = [
    {
      id: "00123",
      date: "2025-07-14",
      sender: "Name",
      recipient: "NameReceive",
      subject: "Invoice Details",
      Department: "Finance",
      status: "Pending",
      attachment: "#"
    },
    {
      id: "00124",
      date: "2025-07-15",
      sender: "Audit Dept",
      recipient: "Finance Dept",
      subject: "Budget Report",
      Department: "Finance",
      status: "Completed",
      attachment: "#"
    }
  ];
  
  

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = () => {
    const lowerSearch = searchTerm.toLowerCase();
    const result = data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowerSearch)
      )
    );
    setFilteredData(result);
  };

  return (
    <div>
      <h2>Search Correspondence</h2>
      <input
        type="text"
        placeholder="Search by ID, Date, Subject,Department, Sender/Recipient, Status"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Date</th><th>Sender</th><th>Recipient</th>
            <th>Subject</th><th>Department</th><th>Status</th><th>Attachment</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td><td>{item.date}</td><td>{item.sender}</td><td>{item.recipient}</td>
                <td>{item.subject}</td><td>{item.Department}</td><td>{item.status}</td>
                <td><a href={item.attachment}>View</a></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Search;
