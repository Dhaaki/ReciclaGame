import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RecyclingForm from './pages/RecyclingForm';
import Quiz from './pages/Quiz';
import Ranking from './pages/Ranking';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/recycling" 
            element={user ? <RecyclingForm user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/quiz" 
            element={user ? <Quiz user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/ranking" 
            element={user ? <Ranking /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/history" 
            element={user ? <History user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/analytics" 
            element={user ? <Analytics /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
