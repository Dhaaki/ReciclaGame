import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Ranking.css';

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const response = await api.get('/ranking');
      setRanking(response.data);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (posicao) => {
    if (posicao === 1) return '🥇';
    if (posicao === 2) return '🥈';
    if (posicao === 3) return '🥉';
    return posicao;
  };

  const getLevelEmoji = (nivel) => {
    const emojis = {
      iniciante: '🌱',
      consciente: '🌿',
      sustentável: '🌳',
      'agente verde': '🏆'
    };
    return emojis[nivel] || '🌱';
  };

  if (loading) {
    return <div className="container"><div className="loading">Carregando ranking...</div></div>;
  }

  return (
    <div className="ranking-page">
      <div className="container">
        <div className="ranking-header">
          <h1>🏆 Ranking Geral</h1>
          <p>Veja quem está liderando na reciclagem!</p>
        </div>

        <div className="ranking-card">
          {ranking.length === 0 ? (
            <p className="no-data">Nenhum registro ainda. Seja o primeiro!</p>
          ) : (
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Nome</th>
                  <th>Nível</th>
                  <th>Pontos</th>
                  <th>Registros</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((item) => (
                  <tr key={item.id} className={item.posicao <= 3 ? 'top-three' : ''}>
                    <td className="position">{getMedal(item.posicao)}</td>
                    <td className="name">{item.nome}</td>
                    <td className="level">
                      <span className="level-badge">
                        {getLevelEmoji(item.nivel)} {item.nivel}
                      </span>
                    </td>
                    <td className="points">{item.pontos_totais}</td>
                    <td className="records">{item.total_registros}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ranking;
