import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './context/authStore';
import AuthPages from './pages/Auth';
import MainLayout from './components/Layout/MainLayout';
import './styles/stripe-theme.css';

function App() {
  const { user, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="splash-screen">
        <div className="stripe-logo-loader">
          <svg width="80" height="80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="S-Logo" className="animate-pulse">
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
            </g>
          </svg>
          <p>STRIPE</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="*" element={<AuthPages />} />
        ) : (
          <Route path="/*" element={<MainLayout />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
