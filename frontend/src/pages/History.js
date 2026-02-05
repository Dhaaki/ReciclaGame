import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './History.css';

const History = ({ user }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await api.get(`/recycling-records/user/${user.id}`);
      setRecords(response.data);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaterialEmoji = (tipo) => {
    const emojis = {
      papel: '📄',
      plástico: '🥤',
      metal: '🥫',
      vidro: '🍶'
    };
    return emojis[tipo] || '♻️';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="container"><div className="loading">Carregando histórico...</div></div>;
  }

  return (
    <div className="history-page">
      <div className="container">
        <div className="history-header">
          <h1>📊 Meu Histórico</h1>
          <p>Veja todos os seus registros de reciclagem</p>
        </div>

        <div className="history-card">
          {records.length === 0 ? (
            <div className="no-records">
              <p>Você ainda não registrou nenhuma reciclagem.</p>
              <p>Comece agora e ganhe seus primeiros pontos! 🎯</p>
            </div>
          ) : (
            <div className="records-list">
              {records.map((record) => (
                <div key={record.id} className="record-item">
                  <div className="record-icon">
                    {getMaterialEmoji(record.tipo_material)}
                  </div>
                  <div className="record-details">
                    <h3>{record.tipo_material.charAt(0).toUpperCase() + record.tipo_material.slice(1)}</h3>
                    <p>Quantidade: {record.quantidade} unidade(s)</p>
                    <p className="record-date">{formatDate(record.data_registro)}</p>
                  </div>
                  <div className="record-points">
                    <span className="points-badge">+{record.pontos_gerados} pontos</span>
                  </div>
                  {record.foto_url && (
                    <div className="record-photo">
                      <img 
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${record.foto_url}`} 
                        alt="Reciclagem"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
