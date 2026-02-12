import { useState } from "react";
import UserList from "../components/Admin/UserList";
import AllTasksList from "../components/Admin/AllTasksList";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="container dashboard-container">
      <div className="dashboard-header">
        <div>
           <h1>Admin Dashboard</h1>
           <p>Manage users and view all system tasks</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users Management
        </button>
        <button 
          className={`tab-btn ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          Global Tasks View
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "users" ? <UserList /> : <AllTasksList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
