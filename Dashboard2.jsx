/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import supabase from "./services/supabaseClient";

const Dashboard = () => {
  const [correspondenceData, setCorrespondenceData] = useState([]);

  useEffect(() => {
    const fetchCorrespondence = async () => {
      const { data, error } = await supabase
        .from("correspondence")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching correspondence:", error);
      } else {
        setCorrespondenceData(data);
      }
    };

    fetchCorrespondence();
  }, []);

  const total = correspondenceData.length;
  const pending = correspondenceData.filter(item => item.status?.toLowerCase() === "pending").length;
  const completed = correspondenceData.filter(item => item.status?.toLowerCase() === "completed").length;

  return (
    <div id="dashboard" className="tab-content active">
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
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
            <p className="text-xs uppercase text-gray-500">Completed</p>
            <h3 className="mt-1 text-xl sm:text-2xl font-medium text-green-600">{completed}</h3>
          </div>
        </div>
      </div>

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
          {correspondenceData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.sender}</td>
              <td>{item.recipient}</td>
              <td>{item.subject}</td>
              <td>{item.department}</td>
              <td>{item.status}</td>
              <td>
                {item.file_url ? (
                  <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                ) : (
                  "No file"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
