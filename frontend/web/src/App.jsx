import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';
import AuthPages from './pages/Auth';
import MainLayout from './components/Layout/MainLayout';
import './styles/stripe-theme.css';

function App() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blurple"></div>
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
