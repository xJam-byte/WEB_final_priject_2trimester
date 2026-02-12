import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="url(#navGrad)" />
            <path d="M12 20L17 25L28 14" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="navGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff6b35"/>
                <stop offset="1" stopColor="#9381ff"/>
              </linearGradient>
            </defs>
          </svg>
          Taskify
        </Link>

        {user && (
          <>
            <button
              className="navbar-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>

            <ul className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
              <li>
                <Link
                  to="/dashboard"
                  className={isActive('/dashboard') ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link
                    to="/admin"
                    className={isActive('/admin') ? 'active' : ''}
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/tasks/new"
                  className={isActive('/tasks/new') ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  New Task
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={isActive('/profile') ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>

            <div className="navbar-user">
              <div className="navbar-user-info">
                <div className="navbar-user-name">{user.username}</div>
                <div className="navbar-user-role">{user.role}</div>
              </div>
              <div className="navbar-avatar">{user.username.charAt(0).toUpperCase()}</div>
            </div>
          </>
        )}

        {!user && (
          <ul className="navbar-nav">
            <li>
              <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className={isActive('/register') ? 'active' : ''}>
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}

export default Navbar
