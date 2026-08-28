import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';

function AuthPages() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AuthPages;
