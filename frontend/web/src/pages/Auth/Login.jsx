import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../context/authStore';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: 'admin@stripe-tiktok.com',
    password: 'AdminPassword123!'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 60 45 Q 70 35 85 35 Q 105 35 115 50" 
                  stroke="#635BFF" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
            
            <path d="M 115 50 Q 125 60 115 75 Q 100 90 75 90 Q 50 90 45 100" 
                  stroke="#635BFF" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
            
            <path d="M 45 100 Q 35 110 45 125 Q 60 145 85 150 Q 120 150 140 165" 
                  stroke="#635BFF" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
          </svg>
          <h1>STRIPE</h1>
          <p>The Future of Video</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="admin@stripe.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <a href="/signup">Create one</a>
          </p>
        </div>

        <div className="demo-credentials">
          <p className="text-sm text-gray-500">
            <strong>Demo Account:</strong><br />
            Email: admin@stripe-tiktok.com<br />
            Password: AdminPassword123!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
