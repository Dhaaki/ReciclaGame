const pool = require('../config/database');
const { getQuizPoints, getLevel } = require('../utils/gamification');

const getQuizzes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quizzes ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar quizzes:', error);
    res.status(500).json({ error: 'Erro ao buscar quizzes' });
  }
};

const answerQuiz = async (req, res) => {
  try {
    const { user_id, quiz_id, resposta_usuario } = req.body;

    if (!user_id || !quiz_id || !resposta_usuario) {
      return res.status(400).json({ error: 'user_id, quiz_id e resposta_usuario são obrigatórios' });
    }

    // Buscar quiz
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quiz_id]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz não encontrado' });
    }

    const quiz = quizResult.rows[0];

    // Verificar se já respondeu
    const existingAnswer = await pool.query(
      'SELECT * FROM quiz_answers WHERE user_id = $1 AND quiz_id = $2',
      [user_id, quiz_id]
    );

    if (existingAnswer.rows.length > 0) {
      return res.status(400).json({ error: 'Você já respondeu este quiz' });
    }

    // Verificar resposta
    const correta = quiz.resposta_correta.toLowerCase() === resposta_usuario.toLowerCase();

    // Inserir resposta
    await pool.query(
      `INSERT INTO quiz_answers (user_id, quiz_id, resposta_usuario, correta)
       VALUES ($1, $2, $3, $4)`,
      [user_id, quiz_id, resposta_usuario, correta]
    );

    let pontosAdicionados = 0;
    if (correta) {
      pontosAdicionados = getQuizPoints();

      // Atualizar pontuação do usuário
      const scoreResult = await pool.query(
        'SELECT pontos_totais FROM scores WHERE user_id = $1',
        [user_id]
      );

      let pontosTotais = pontosAdicionados;
      if (scoreResult.rows.length > 0) {
        pontosTotais = scoreResult.rows[0].pontos_totais + pontosAdicionados;
      }

      // Determinar novo nível
      const novoNivel = getLevel(pontosTotais);

      // Atualizar score
      if (scoreResult.rows.length > 0) {
        await pool.query(
          'UPDATE scores SET pontos_totais = $1, nivel = $2, data_atualizacao = CURRENT_TIMESTAMP WHERE user_id = $3',
          [pontosTotais, novoNivel, user_id]
        );
      } else {
        await pool.query(
          'INSERT INTO scores (user_id, pontos_totais, nivel) VALUES ($1, $2, $3)',
          [user_id, pontosTotais, novoNivel]
        );
      }
    }

    res.json({
      correta,
      pontos_adicionados: pontosAdicionados,
      mensagem: correta ? 'Resposta correta! Você ganhou pontos!' : 'Resposta incorreta. Continue estudando!'
    });
  } catch (error) {
    console.error('Erro ao processar resposta do quiz:', error);
    res.status(500).json({ error: 'Erro ao processar resposta do quiz' });
  }
};

module.exports = {
  getQuizzes,
  answerQuiz
};
