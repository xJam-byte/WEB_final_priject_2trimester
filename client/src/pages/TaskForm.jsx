import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { taskApi } from '../api/tasks'

const TaskForm = () => {
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: false,
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditMode)

  const navigate = useNavigate()

  useEffect(() => {
    if (isEditMode) {
      fetchTask()
    }
  }, [id])

  const fetchTask = async () => {
    try {
      const response = await taskApi.getTask(id)
      const task = response.data
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status || false,
      })
    } catch (err) {
      setApiError('Failed to load task')
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters'
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setApiError('')

    try {
      const data = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null,
        status: formData.status,
      }

      if (isEditMode) {
        await taskApi.updateTask(id, data)
      } else {
        await taskApi.createTask(data)
      }

      navigate('/dashboard')
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.map((e) => e.message).join(', ') ||
        `Failed to ${isEditMode ? 'update' : 'create'} task. Please try again.`
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading task...</p>
      </div>
    )
  }

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1>{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>
      </div>

      <div className="card">
        {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter task title"
              maxLength={100}
            />
            {errors.title && <p className="form-error">⚠️ {errors.title}</p>}
            <p className="form-hint">{formData.title.length}/100 characters</p>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-input ${errors.description ? 'error' : ''}`}
              placeholder="Enter task description (optional)"
              rows={4}
              maxLength={500}
            />
            {errors.description && <p className="form-error">⚠️ {errors.description}</p>}
            <p className="form-hint">{formData.description.length}/500 characters</p>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="form-input"
            />
            <p className="form-hint">Optional - Set a deadline for this task</p>
          </div>

          {isEditMode && (
            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                Mark as completed
              </label>
            </div>
          )}

          <div className="flex gap-md">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                ? 'Update Task'
                : 'Create Task'}
            </button>
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
