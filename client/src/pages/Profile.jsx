import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userApi } from '../api/tasks'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setApiError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setApiError('')
    setSuccess('')

    try {
      const response = await userApi.updateProfile(formData)
      updateUser(response.data)
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.map((e) => e.message).join(', ') ||
        'Failed to update profile. Please try again.'
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    })
    setErrors({})
    setApiError('')
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h1>{user?.username}</h1>
          <p className="text-muted">{user?.email}</p>
          <span className={`profile-badge ${user?.role === 'admin' ? 'admin' : ''}`}>
            {user?.role}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Profile Settings</h2>
          <p className="card-subtitle">Update your personal information</p>
        </div>

        {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}
        {success && <div className="alert alert-success">✓ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'error' : ''}`}
              disabled={!isEditing}
            />
            {errors.username && <p className="form-error">⚠️ {errors.username}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={!isEditing}
            />
            {errors.email && <p className="form-error">⚠️ {errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <input type="text" value={user?.role} className="form-input" disabled />
            <p className="form-hint">Role cannot be changed</p>
          </div>

          <div className="form-group">
            <label className="form-label">Member Since</label>
            <input
              type="text"
              value={formatDate(user?.createdAt)}
              className="form-input"
              disabled
            />
          </div>

          {isEditing ? (
            <div className="flex gap-md">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default Profile
