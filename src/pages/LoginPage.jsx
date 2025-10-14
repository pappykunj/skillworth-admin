
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api/admin';
import Snackbar from '../components/Snackbar';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSnackbar({ message: 'Signing in...', type: 'loading' });
    try {
      const res = await loginAdmin({ email, password });
      // Explicitly check for token and save to localStorage
      if (res && res.token && res.admin) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('admin', JSON.stringify(res.admin));
        setSnackbar({ message: 'Login successful!', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setSnackbar({ message: 'Login failed: Invalid response from server.', type: 'error' });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Invalid email or password';
      setSnackbar({ message: errorMessage, type: 'error' });
    }
  };

  const closeSnackbar = () => {
    setSnackbar({ message: '', type: '' });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <div className="login-form">
            <h2>Welcome Back!</h2>
            <p>Sign in to continue to your account</p>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit" disabled={snackbar.type === 'loading'}>
                {snackbar.type === 'loading' ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
        <div className="login-image-container">
        </div>
      </div>
      <Snackbar 
        message={snackbar.message} 
        type={snackbar.type} 
        onClose={closeSnackbar} 
      />
    </div>
  );
};

export default LoginPage;
