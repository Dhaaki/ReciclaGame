import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          🌱 Reciclagem Game
        </Link>
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/recycling" className="navbar-link">Registrar Reciclagem</Link>
          <Link to="/quiz" className="navbar-link">Quiz</Link>
          <Link to="/ranking" className="navbar-link">Ranking</Link>
          <Link to="/history" className="navbar-link">Histórico</Link>
          <Link to="/analytics" className="navbar-link">📊 Análises</Link>
          <div className="navbar-user">
            <span>{user?.nome}</span>
            <span className="navbar-level">{user?.nivel || 'iniciante'}</span>
            <button onClick={onLogout} className="btn-logout">Sair</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
