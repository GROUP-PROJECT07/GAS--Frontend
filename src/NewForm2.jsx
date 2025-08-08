import React, { useState } from "react";
import { supabase } from "./services/supabaseClient"; 

const NewForm = ({ addCorrespondence }) => {
  const [formData, setFormData] = useState({
    date: "",
    sender: "",
    recipient: "",
    subject: "",
    department: "",
    status: "Pending",
    attachment: null,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment" && files.length > 0) {
      setFormData({ ...formData, attachment: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let fileUrl = null;

    if (formData.attachment) {
      const filePath = `files/${Date.now()}-${formData.attachment.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("correspondence-files")
        .upload(filePath, formData.attachment);

      if (uploadError) {
        console.error("File upload failed:", uploadError.message);
        return;
      }

      fileUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/correspondence-files/${filePath}`;
    }

    const { data, error } = await supabase
      .from("correspondence")
      .insert([
        {
          date: formData.date,
          sender: formData.sender,
          recipient: formData.recipient,
          subject: formData.subject,
          department: formData.department,
          status: formData.status,
          file_url: fileUrl,
          message: formData.message,
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

    setFormData({
      date: "",
      sender: "",
      recipient: "",
      subject: "",
      department: "",
      status: "Pending",
      attachment: null,
      message: "",
    });
  };

  return (
    <div>
      <h2>New Correspondence</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Sender:</label>
          <input type="text" name="sender" value={formData.sender} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Recipient:</label>
          <input type="text" name="recipient" value={formData.recipient} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Department:</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Attachment (PDF/Image):</label>
          <input type="file" name="attachment" accept=".pdf,.jpg,.png" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Message content (optional):</label>
          <textarea
            name="message"
            value={formData.message}
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

