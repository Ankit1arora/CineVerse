import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Film } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath, ROLE_LABELS } from '../../utils/helpers';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (user?.role) {
      navigate(getDashboardPath(user.role));
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <Film className="logo-icon" size={28} />
          <span>CineVerse</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <div className="navbar-user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{ROLE_LABELS[user?.role]}</span>
              </div>

              <button className="nav-link dashboard-btn" onClick={handleDashboardClick}>
                Dashboard
              </button>

              <Link to={`/user/profile`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <User size={18} />
                Profile
              </Link>

              <button className="nav-link logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link register-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
