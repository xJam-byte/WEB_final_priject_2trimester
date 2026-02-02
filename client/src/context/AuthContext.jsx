import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await api.get('/users/profile')
        setUser(response.data.data)
      } catch (error) {
        localStorage.removeItem('token')
        setUser(null)
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, user: userData } = response.data.data
    localStorage.setItem('token', token)
    setUser(userData)
    return response.data
  }

  const register = async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password })
    const { token, user: userData } = response.data.data
    localStorage.setItem('token', token)
    setUser(userData)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser(userData)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
