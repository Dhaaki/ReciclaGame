const pool = require('../config/database');

const getRanking = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        u.id,
        u.nome,
        u.email,
        s.pontos_totais,
        s.nivel,
        COUNT(r.id) as total_registros
       FROM users u
       LEFT JOIN scores s ON u.id = s.user_id
       LEFT JOIN recycling_records r ON u.id = r.user_id
       WHERE u.tipo = 'aluno'
       GROUP BY u.id, u.nome, u.email, s.pontos_totais, s.nivel
       ORDER BY s.pontos_totais DESC NULLS LAST, u.nome
       LIMIT 100`
    );

    // Adicionar posição no ranking
    const ranking = result.rows.map((row, index) => ({
      posicao: index + 1,
      ...row,
      pontos_totais: row.pontos_totais || 0,
      nivel: row.nivel || 'iniciante',
      total_registros: parseInt(row.total_registros) || 0
    }));

    res.json(ranking);
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
};

module.exports = {
  getRanking
};
