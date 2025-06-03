import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import MyCustomers from './pages/MyCustomers';
import MyGames from './pages/MyGames';
import MyRevenue from './pages/MyRevenue';
import DepositRequests from './pages/DepositRequests';
import WithdrawalRequests from './pages/WithdrawalRequests';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Layout onLogout={handleLogout}>
                <Dashboard />
              </Layout> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/customers" 
          element={
            isAuthenticated ? 
              <Layout onLogout={handleLogout}>
                <MyCustomers />
              </Layout> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/games" 
          element={
            isAuthenticated ? 
              <Layout onLogout={handleLogout}>
                <MyGames />
              </Layout> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/revenue" 
          element={
            isAuthenticated ? 
              <Layout onLogout={handleLogout}>
                <MyRevenue />
              </Layout> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/deposit-requests" 
          element={
            isAuthenticated ? 
              <Layout onLogout={handleLogout}>
                <DepositRequests />
              </Layout> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/withdrawal-requests" 
          element={
            isAuthenticated ? 
              <Layout onLogout={handleLogout}>
                <WithdrawalRequests />
              </Layout> : 
              <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;