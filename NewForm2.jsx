import React, { useState } from "react";

const NewForm = ({ addCorrespondence }) => {
  const [formData, setFormData] = useState({
    ID: `CMS-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
    Date: "",
    Sender: "",
    Recipient: "",
    Subject: "",
    Department: "",
    Status: "Pending",
    Attachment: "View"
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Attachment" && files.length > 0) {
      setFormData({ ...formData, Attachment: files[0].name });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCorrespondence(formData);

    // Reset form
    setFormData({
      ID: `CMS-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      Date: "",
      Sender: "",
      Recipient: "",
      Subject: "",
      Department: "",
      Status: "Pending",
      Attachment: "View"
    });
  };

  return (
    <div>
      <h2>New Correspondence</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="Date" value={formData.Date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Sender:</label>
          <input type="text" name="Sender" value={formData.Sender} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Recipient:</label>
          <input type="text" name="Recipient" value={formData.Recipient} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <input type="text" name="Subject" value={formData.Subject} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Department:</label>
          <input type="text" name="Department" value={formData.Department} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select name="Status" value={formData.Status} onChange={handleChange}>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Attachment (PDF/Image):</label>
          <input type="file" name="Attachment" accept=".pdf,.jpg,.png" onChange={handleChange} />
        </div>
        <textarea placeholder="Message content..." />
        <button type="submit">Save Correspondence</button>
      </form>
    </div>
  );
};

export default NewForm;
