import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import '../../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [demoUsers] = useState([
    { email: 'user@example.com', password: 'password', role: 'User' },
    { email: 'owner@example.com', password: 'password', role: 'Theatre Owner' },
    { email: 'admin@example.com', password: 'password', role: 'Admin' },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user, token } = await authService.login(
        formData.email,
        formData.password
      );
      login(user, token);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email) => {
    setFormData({ email, password: 'password' });
    setLoading(true);
    setError('');

    try {
      const { user, token } = await authService.login(email, 'password');
      login(user, token);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <LogIn size={32} className="auth-icon" />
          <h1>Welcome to CineVerse</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            fullWidth 
            loading={loading}
            variant="primary"
          >
            Sign In
          </Button>
        </form>

        <div className="auth-divider">
          <span>Demo Accounts</span>
        </div>

        <div className="demo-buttons">
          {demoUsers.map((user) => (
            <button
              key={user.email}
              type="button"
              className="demo-btn"
              onClick={() => handleDemoLogin(user.email)}
              disabled={loading}
            >
              <span className="demo-label">{user.role}</span>
              <span className="demo-email">{user.email}</span>
            </button>
          ))}
        </div>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
