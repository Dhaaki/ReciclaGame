import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = ({ user, setUser }) => {
  const [stats, setStats] = useState({
    pontos_totais: 0,
    nivel: 'iniciante',
    total_registros: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const [scoreResponse, recordsResponse] = await Promise.all([
        api.get(`/scores/${user.id}`),
        api.get(`/recycling-records/user/${user.id}`)
      ]);

      setStats({
        pontos_totais: scoreResponse.data.pontos_totais || 0,
        nivel: scoreResponse.data.nivel || 'iniciante',
        total_registros: recordsResponse.data.length || 0
      });

      // Atualizar user no estado
      if (scoreResponse.data.pontos_totais !== user.pontos_totais) {
        setUser({
          ...user,
          pontos_totais: scoreResponse.data.pontos_totais,
          nivel: scoreResponse.data.nivel
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelInfo = (nivel) => {
    const levels = {
      iniciante: { emoji: '🌱', color: '#28a745', next: 'Consciente' },
      consciente: { emoji: '🌿', color: '#17a2b8', next: 'Sustentável' },
      sustentável: { emoji: '🌳', color: '#007bff', next: 'Agente Verde' },
      'agente verde': { emoji: '🏆', color: '#ffc107', next: 'Máximo' }
    };
    return levels[nivel] || levels.iniciante;
  };

  const levelInfo = getLevelInfo(stats.nivel);

  if (loading) {
    return <div className="container"><div className="loading">Carregando...</div></div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="dashboard-title">Bem-vindo, {user.nome}! 👋</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>Pontos Totais</h3>
              <p className="stat-value">{stats.pontos_totais}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">{levelInfo.emoji}</div>
            <div className="stat-content">
              <h3>Nível Atual</h3>
              <p className="stat-value" style={{ color: levelInfo.color, textTransform: 'capitalize' }}>
                {stats.nivel}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">♻️</div>
            <div className="stat-content">
              <h3>Registros</h3>
              <p className="stat-value">{stats.total_registros}</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <Link to="/recycling" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Registrar Reciclagem</h3>
            <p>Adicione materiais reciclados e ganhe pontos!</p>
          </Link>

          <Link to="/quiz" className="action-card">
            <div className="action-icon">❓</div>
            <h3>Responder Quiz</h3>
            <p>Teste seus conhecimentos e ganhe pontos extras!</p>
          </Link>

          <Link to="/ranking" className="action-card">
            <div className="action-icon">🏆</div>
            <h3>Ver Ranking</h3>
            <p>Veja sua posição no ranking geral!</p>
          </Link>

          <Link to="/history" className="action-card">
            <div className="action-icon">📊</div>
            <h3>Histórico</h3>
            <p>Visualize seu histórico de reciclagem!</p>
          </Link>

          {user?.tipo === 'professor' && (
            <Link to="/analytics" className="action-card">
              <div className="action-icon">📈</div>
              <h3>Análises e Métricas</h3>
              <p>Veja estatísticas detalhadas dos alunos!</p>
            </Link>
          )}
        </div>

        <div className="info-card">
          <h2>📚 Como Funciona?</h2>
          <ul>
            <li><strong>Papel:</strong> 10 pontos por unidade</li>
            <li><strong>Plástico:</strong> 15 pontos por unidade</li>
            <li><strong>Metal:</strong> 20 pontos por unidade</li>
            <li><strong>Vidro:</strong> 25 pontos por unidade</li>
            <li><strong>Quiz correto:</strong> 50 pontos extras</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
