import { useState, useEffect } from "react";
import { adminApi } from "../../api/admin";

const AllTasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await adminApi.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-section">
      <h3>All Tasks ({tasks.length})</h3>
      <div className="tasks-grid">
        {tasks.map((task) => (
          <div key={task._id} className={`task-card ${task.status ? "completed" : ""}`}>
            <div className="task-header">
              <span className="task-user-badge" title={`Owner: ${task.user?.username}`}>
                {task.user?.username?.charAt(0).toUpperCase()}
              </span>
              <span className={`status-badge ${task.status ? "done" : "pending"}`}>
                {task.status ? "Completed" : "Pending"}
              </span>
            </div>
            <h4>{task.title}</h4>
            <p className="task-desc">{task.description}</p>
            <div className="task-meta">
               <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
               {task.dueDate && <small>Due: {new Date(task.dueDate).toLocaleDateString()}</small>}
            </div>
            <div className="task-owner">
              <small>Owner: {task.user?.email}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTasksList;
