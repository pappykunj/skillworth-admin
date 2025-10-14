import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

function App() {
  // For this example, we'll assume a simple auth check.
  // In a real app, you would have a more robust authentication flow.
  const isAuthenticated = true; // Or your auth logic here

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard/*" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route 
          path="/" 
          element={<Navigate to="/dashboard/home" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
