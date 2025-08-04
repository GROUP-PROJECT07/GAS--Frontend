/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

const Dashboard = ({ correspondenceData }) => {
  const total = correspondenceData.length;
  const pending = correspondenceData.filter(item => item.Status?.toLowerCase() === "pending").length;
  const completed = correspondenceData.filter(item => item.Status?.toLowerCase() === "completed").length;
  
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
          {correspondenceData.map((item, index) => (
            <tr key={index}>
              <td>{item.ID}</td>
              <td>{item.Date}</td>
              <td>{item.Sender}</td>
              <td>{item.Recipient}</td>
              <td>{item.Subject}</td>
              <td>{item.Department}</td>
              <td>{item.Status}</td>
              <td><a href="#">{item.Attachment}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;

