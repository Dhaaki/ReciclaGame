const pool = require('../config/database');

// Métricas por turma
const getMetricsByTurma = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.turma,
        COUNT(DISTINCT u.id) as total_alunos,
        COALESCE(SUM(r.quantidade), 0) as total_materiais,
        COALESCE(SUM(r.pontos_gerados), 0) as total_pontos,
        COALESCE(AVG(s.pontos_totais), 0) as media_pontos
      FROM users u
      LEFT JOIN recycling_records r ON u.id = r.user_id
      LEFT JOIN scores s ON u.id = s.user_id
      WHERE u.tipo = 'aluno' AND u.turma IS NOT NULL
      GROUP BY u.turma
      ORDER BY total_pontos DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar métricas por turma:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas por turma' });
  }
};

// Métricas por idade
const getMetricsByIdade = async (req, res) => {
  try {
    // Buscar todos os dados primeiro e processar em JavaScript para evitar problemas com GROUP BY
    const allData = await pool.query(`
      SELECT 
        u.id,
        u.idade,
        COALESCE(SUM(r.quantidade), 0) as total_materiais,
        COALESCE(SUM(r.pontos_gerados), 0) as total_pontos
      FROM users u
      LEFT JOIN recycling_records r ON u.id = r.user_id
      WHERE u.tipo = 'aluno'
      GROUP BY u.id, u.idade
    `);

    // Agrupar por faixa etária em JavaScript
    const faixas = {
      'Menos de 10 anos': { total_alunos: 0, total_materiais: 0, total_pontos: 0 },
      '10-11 anos': { total_alunos: 0, total_materiais: 0, total_pontos: 0 },
      '12-13 anos': { total_alunos: 0, total_materiais: 0, total_pontos: 0 },
      '14+ anos': { total_alunos: 0, total_materiais: 0, total_pontos: 0 },
      'Não informado': { total_alunos: 0, total_materiais: 0, total_pontos: 0 }
    };

    allData.rows.forEach(row => {
      let faixa = 'Não informado';
      if (row.idade === null || row.idade === undefined) {
        faixa = 'Não informado';
      } else if (row.idade < 10) {
        faixa = 'Menos de 10 anos';
      } else if (row.idade >= 10 && row.idade <= 11) {
        faixa = '10-11 anos';
      } else if (row.idade >= 12 && row.idade <= 13) {
        faixa = '12-13 anos';
      } else if (row.idade >= 14) {
        faixa = '14+ anos';
      }

      faixas[faixa].total_alunos++;
      faixas[faixa].total_materiais += parseInt(row.total_materiais) || 0;
      faixas[faixa].total_pontos += parseInt(row.total_pontos) || 0;
    });

    // Converter para array e ordenar
    const result = [
      { faixa_etaria: 'Menos de 10 anos', ...faixas['Menos de 10 anos'] },
      { faixa_etaria: '10-11 anos', ...faixas['10-11 anos'] },
      { faixa_etaria: '12-13 anos', ...faixas['12-13 anos'] },
      { faixa_etaria: '14+ anos', ...faixas['14+ anos'] },
      { faixa_etaria: 'Não informado', ...faixas['Não informado'] }
    ];

    console.log('📊 Métricas por idade:', result);
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar métricas por idade:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas por idade', details: error.message });
  }
};

// Métricas por sexo
const getMetricsBySexo = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COALESCE(u.sexo, 'Não informado') as sexo,
        COUNT(DISTINCT u.id) as total_alunos,
        COALESCE(SUM(r.quantidade), 0) as total_materiais,
        COALESCE(SUM(r.pontos_gerados), 0) as total_pontos,
        COALESCE(AVG(s.pontos_totais), 0) as media_pontos
      FROM users u
      LEFT JOIN recycling_records r ON u.id = r.user_id
      LEFT JOIN scores s ON u.id = s.user_id
      WHERE u.tipo = 'aluno'
      GROUP BY u.sexo
      ORDER BY total_pontos DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar métricas por sexo:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas por sexo' });
  }
};

// Métricas por tipo de material
const getMetricsByMaterial = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        tipo_material,
        COUNT(*) as total_registros,
        COALESCE(SUM(quantidade), 0) as total_quantidade,
        COALESCE(SUM(pontos_gerados), 0) as total_pontos,
        COALESCE(AVG(quantidade), 0) as media_quantidade
      FROM recycling_records
      GROUP BY tipo_material
      ORDER BY total_quantidade DESC
    `);

    console.log('📊 Métricas por material:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar métricas por material:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas por material', details: error.message });
  }
};

// Estatísticas gerais
const getGeneralStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE tipo = 'aluno') as total_alunos,
        (SELECT COUNT(*) FROM recycling_records) as total_registros,
        (SELECT COALESCE(SUM(quantidade), 0) FROM recycling_records) as total_materiais,
        (SELECT COALESCE(SUM(pontos_totais), 0) FROM scores) as total_pontos_geral,
        (SELECT COALESCE(AVG(pontos_totais), 0) FROM scores) as media_pontos_geral,
        (SELECT COUNT(DISTINCT turma) FROM users WHERE tipo = 'aluno' AND turma IS NOT NULL) as total_turmas
    `);

    console.log('📊 Estatísticas gerais:', stats.rows[0]);
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar estatísticas gerais:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas gerais', details: error.message });
  }
};

// Top turmas
const getTopTurmas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.turma,
        COUNT(DISTINCT u.id) as total_alunos,
        COALESCE(SUM(r.pontos_gerados), 0) as total_pontos
      FROM users u
      LEFT JOIN recycling_records r ON u.id = r.user_id
      WHERE u.tipo = 'aluno' AND u.turma IS NOT NULL
      GROUP BY u.turma
      ORDER BY total_pontos DESC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar top turmas:', error);
    res.status(500).json({ error: 'Erro ao buscar top turmas' });
  }
};

module.exports = {
  getMetricsByTurma,
  getMetricsByIdade,
  getMetricsBySexo,
  getMetricsByMaterial,
  getGeneralStats,
  getTopTurmas
};
