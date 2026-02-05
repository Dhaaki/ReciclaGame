import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../services/api';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    geral: {},
    turma: [],
    idade: [],
    sexo: [],
    material: [],
    topTurmas: []
  });

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchAllMetrics();
  };

  const fetchAllMetrics = async () => {
    try {
      console.log('📊 Buscando métricas...');
      const [geral, turma, idade, sexo, material, topTurmas] = await Promise.all([
        api.get('/analytics/geral'),
        api.get('/analytics/turma'),
        api.get('/analytics/idade'),
        api.get('/analytics/sexo'),
        api.get('/analytics/material'),
        api.get('/analytics/top-turmas')
      ]);

      console.log('📊 Dados recebidos:', {
        geral: geral.data,
        turma: turma.data,
        idade: idade.data,
        sexo: sexo.data,
        material: material.data,
        topTurmas: topTurmas.data
      });

      setStats({
        geral: geral.data,
        turma: turma.data,
        idade: idade.data,
        sexo: sexo.data,
        material: material.data,
        topTurmas: topTurmas.data
      });
    } catch (error) {
      console.error('❌ Erro ao buscar métricas:', error);
      console.error('Detalhes do erro:', error.response?.data || error.message);
      // Mostrar erro na tela também
      alert('Erro ao carregar métricas. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  // Gráfico de materiais mais reciclados
  const materialChartData = {
    labels: stats.material && stats.material.length > 0 
      ? stats.material.map(m => m.tipo_material?.charAt(0).toUpperCase() + m.tipo_material?.slice(1) || 'N/A')
      : ['Nenhum dado'],
    datasets: [{
      label: 'Quantidade Total',
      data: stats.material && stats.material.length > 0
        ? stats.material.map(m => parseInt(m.total_quantidade) || 0)
        : [0],
      backgroundColor: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(40, 167, 69, 0.8)'
      ],
      borderColor: [
        'rgba(102, 126, 234, 1)',
        'rgba(118, 75, 162, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(40, 167, 69, 1)'
      ],
      borderWidth: 2
    }]
  };

  // Gráfico de top turmas
  const topTurmasChartData = {
    labels: stats.topTurmas && stats.topTurmas.length > 0
      ? stats.topTurmas.map(t => t.turma || 'Sem turma')
      : ['Nenhum dado'],
    datasets: [{
      label: 'Total de Pontos',
      data: stats.topTurmas && stats.topTurmas.length > 0
        ? stats.topTurmas.map(t => parseInt(t.total_pontos) || 0)
        : [0],
      backgroundColor: 'rgba(102, 126, 234, 0.8)',
      borderColor: 'rgba(102, 126, 234, 1)',
      borderWidth: 2
    }]
  };

  // Gráfico por idade
  const idadeChartData = {
    labels: stats.idade.map(i => i.faixa_etaria),
    datasets: [{
      label: 'Total de Materiais',
      data: stats.idade.map(i => parseInt(i.total_materiais) || 0),
      backgroundColor: 'rgba(118, 75, 162, 0.8)',
      borderColor: 'rgba(118, 75, 162, 1)',
      borderWidth: 2
    }]
  };

  // Gráfico por sexo (Doughnut)
  const sexoChartData = {
    labels: stats.sexo.map(s => s.sexo),
    datasets: [{
      data: stats.sexo.map(s => parseInt(s.total_materiais) || 0),
      backgroundColor: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(40, 167, 69, 0.8)'
      ],
      borderColor: [
        'rgba(102, 126, 234, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(40, 167, 69, 1)'
      ],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: {
          size: 16
        }
      }
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Carregando análises...</div></div>;
  }

  return (
    <div className="analytics-page">
      <div className="container">
        <div className="analytics-header">
          <div>
            <h1>📊 Análises e Métricas</h1>
            <p>Estatísticas detalhadas sobre reciclagem e desempenho dos alunos</p>
          </div>
          <button onClick={handleRefresh} className="btn btn-primary" style={{ marginTop: '10px' }}>
            🔄 Atualizar Dados
          </button>
        </div>

        {/* Cards de Estatísticas Gerais */}
        <div className="stats-cards">
          <div className="stat-card-general">
            <div className="stat-icon-general">👥</div>
            <div className="stat-content-general">
              <h3>Total de Alunos</h3>
              <p className="stat-value-general">{stats.geral.total_alunos || 0}</p>
            </div>
          </div>
          <div className="stat-card-general">
            <div className="stat-icon-general">♻️</div>
            <div className="stat-content-general">
              <h3>Registros de Reciclagem</h3>
              <p className="stat-value-general">{stats.geral.total_registros || 0}</p>
            </div>
          </div>
          <div className="stat-card-general">
            <div className="stat-icon-general">📦</div>
            <div className="stat-content-general">
              <h3>Total de Materiais</h3>
              <p className="stat-value-general">{stats.geral.total_materiais || 0}</p>
            </div>
          </div>
          <div className="stat-card-general">
            <div className="stat-icon-general">⭐</div>
            <div className="stat-content-general">
              <h3>Pontos Totais</h3>
              <p className="stat-value-general">{stats.geral.total_pontos_geral || 0}</p>
            </div>
          </div>
          <div className="stat-card-general">
            <div className="stat-icon-general">📚</div>
            <div className="stat-content-general">
              <h3>Total de Turmas</h3>
              <p className="stat-value-general">{stats.geral.total_turmas || 0}</p>
            </div>
          </div>
          <div className="stat-card-general">
            <div className="stat-icon-general">📈</div>
            <div className="stat-content-general">
              <h3>Média de Pontos</h3>
              <p className="stat-value-general">{Math.round(stats.geral.media_pontos_geral || 0)}</p>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="charts-grid">
          <div className="chart-card">
            <h2>📊 Materiais Mais Reciclados</h2>
            <div className="chart-container">
              <Bar data={materialChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h2>🏆 Top 10 Turmas por Pontuação</h2>
            <div className="chart-container">
              <Bar data={topTurmasChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h2>👥 Reciclagem por Faixa Etária</h2>
            <div className="chart-container">
              <Bar data={idadeChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h2>⚧️ Reciclagem por Sexo</h2>
            <div className="chart-container">
              <Doughnut data={sexoChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Tabelas Detalhadas */}
        <div className="tables-grid">
          <div className="table-card">
            <h2>📚 Desempenho por Turma</h2>
            <div className="table-container">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Turma</th>
                    <th>Alunos</th>
                    <th>Materiais</th>
                    <th>Pontos</th>
                    <th>Média</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.turma.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-data">Nenhum dado disponível</td>
                    </tr>
                  ) : (
                    stats.turma.map((item, index) => (
                      <tr key={index}>
                        <td>{item.turma || 'Sem turma'}</td>
                        <td>{item.total_alunos}</td>
                        <td>{item.total_materiais}</td>
                        <td className="points-cell">{item.total_pontos}</td>
                        <td>{Math.round(item.media_pontos)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-card">
            <h2>📦 Detalhamento por Material</h2>
            <div className="table-container">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Registros</th>
                    <th>Quantidade</th>
                    <th>Pontos</th>
                    <th>Média Qtd</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.material.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-data">Nenhum dado disponível</td>
                    </tr>
                  ) : (
                    stats.material.map((item, index) => (
                      <tr key={index}>
                        <td className="material-cell">
                          {item.tipo_material?.charAt(0).toUpperCase() + item.tipo_material?.slice(1) || 'N/A'}
                        </td>
                        <td>{item.total_registros}</td>
                        <td>{item.total_quantidade}</td>
                        <td className="points-cell">{item.total_pontos}</td>
                        <td>{Math.round(item.media_quantidade * 10) / 10}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
