import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { taskApi } from '../api/tasks'
import TaskItem from '../components/TaskItem'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    sort: '-createdAt',
  })

  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
  }, [filters])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await taskApi.getTasks(filters)
      setTasks(response.data)
    } catch (err) {
      setError('Failed to load tasks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id, currentStatus) => {
    try {
      await taskApi.toggleTask(id, currentStatus)
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? { ...task, status: !currentStatus } : task))
      )
    } catch (err) {
      console.error('Failed to toggle task:', err)
    }
  }

  const handleEdit = (id) => {
    navigate(`/tasks/${id}/edit`)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await taskApi.deleteTask(id)
      setTasks((prev) => prev.filter((task) => task._id !== id))
    } catch (err) {
      console.error('Failed to delete task:', err)
      alert('Failed to delete task. Please try again.')
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status).length,
    pending: tasks.filter((t) => !t.status).length,
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Tasks</h1>
        <Link to="/tasks/new" className="btn btn-primary">
          + New Task
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon total">📋</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">✅</div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Tasks</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Sort by:</span>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="dueDate">Due Date (Earliest)</option>
            <option value="-dueDate">Due Date (Latest)</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="10"
              y="20"
              width="80"
              height="60"
              rx="8"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <line
              x1="25"
              y1="40"
              x2="75"
              y2="40"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="25"
              y1="55"
              x2="60"
              y2="55"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <h3>No tasks yet</h3>
          <p>Create your first task to get started!</p>
          <Link to="/tasks/new" className="btn btn-primary">
            + Create Task
          </Link>
        </div>
      ) : (
        /* Task List */
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
