import React, { useState } from "react";
import supabase from "./services/supabaseClient";

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
      const { error: uploadError } = await supabase.storage
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

    // Reset form
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
        <table>
          <tbody>
            <tr>
              <td><label>Date</label></td>
              <td>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>Sender</label></td>
              <td>
                <input
                  type="text"
                  name="sender"
                  value={formData.sender}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>Recipient</label></td>
              <td>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>Subject</label></td>
              <td>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>Department</label></td>
              <td>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>Status</label></td>
              <td>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label>Attachment</label></td>
              <td>
                <input
                  type="file"
                  name="attachment"
                  accept=".pdf,.jpg,.png"
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td><label>Message</label></td>
              <td>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message content (optional)"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Save Correspondence
        </button>
      </form>
    </div>
  );
};

export default NewForm;
