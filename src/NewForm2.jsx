import React, { useState } from "react";
import supabase from "./services/supabaseClient";

const NewForm = ({ addCorrespondence }) => {
  const [formData, setFormData] = useState({
    ID: `CMS-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    Date: "",
    Sender: "",
    Recipient: "",
    Subject: "",
    Department: "",
    Status: "Pending",
    Attachment: null,
    Message: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Attachment" && files.length > 0) {
      setFormData({ ...formData, Attachment: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let fileUrl = null;

    // Upload file to Supabase
    if (formData.Attachment) {
      const filePath = `files/${Date.now()}-${formData.Attachment.name}`;
      const { error: uploadError } = await supabase.storage
        .from("correspondence-files")
        .upload(filePath, formData.Attachment);

      if (uploadError) {
        console.error("File upload failed:", uploadError.message);
        return;
      }

      fileUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/correspondence-files/${filePath}`;
    }

    // Insert into Supabase table
    const { data, error } = await supabase
      .from("correspondence")
      .insert([
        {
          id: formData.ID,
          date: formData.Date,
          sender: formData.Sender,
          recipient: formData.Recipient,
          subject: formData.Subject,
          department: formData.Department,
          status: formData.Status,
          file_url: fileUrl,
          message: formData.Message,
        },
      ])
      .select();

    if (error) {
      console.error("Error saving correspondence:", error.message);
      return;
    }

    if (data && data.length > 0) {
      addCorrespondence(data[0]);
    }

    // Reset form
    setFormData({
      ID: `CMS-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      Date: "",
      Sender: "",
      Recipient: "",
      Subject: "",
      Department: "",
      Status: "Pending",
      Attachment: null,
      Message: "",
    });
  };

  return (
    <div>
      <h2>New Correspondence</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="Date"
            value={formData.Date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Sender:</label>
          <input
            type="text"
            name="Sender"
            value={formData.Sender}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Recipient:</label>
          <input
            type="text"
            name="Recipient"
            value={formData.Recipient}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <input
            type="text"
            name="Subject"
            value={formData.Subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Department:</label>
          <input
            type="text"
            name="Department"
            value={formData.Department}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select
            name="Status"
            value={formData.Status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Attachment (PDF/Image):</label>
          <input
            type="file"
            name="Attachment"
            accept=".pdf,.jpg,.png"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            name="Message"
            value={formData.Message}
            onChange={handleChange}
            placeholder="Message content (optional)"
          />
        </div>
        <button type="submit">Save Correspondence</button>
      </form>
    </div>
  );
};

export default NewForm;
