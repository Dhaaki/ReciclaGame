const pool = require('../config/database');

const getScoreByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'SELECT * FROM scores WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        user_id: parseInt(userId),
        pontos_totais: 0,
        nivel: 'iniciante'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar pontuação:', error);
    res.status(500).json({ error: 'Erro ao buscar pontuação' });
  }
};

module.exports = {
  getScoreByUserId
};
