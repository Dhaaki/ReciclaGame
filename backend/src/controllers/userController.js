const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo, turma, idade, sexo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Verificar se email já existe
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Converter idade para número se fornecida
    const idadeNum = idade && !isNaN(idade) ? parseInt(idade) : null;
    
    // Verificar se as colunas existem na tabela (tentativa de inserção adaptativa)
    let result;
    try {
      // Tentar inserir com todos os campos
      result = await pool.query(
        'INSERT INTO users (nome, email, senha, tipo, turma, idade, sexo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nome, email, tipo, turma, idade, sexo, data_criacao',
        [nome, email, hashedPassword, tipo || 'aluno', turma || null, idadeNum, sexo || null]
      );
    } catch (columnError) {
      // Se der erro de coluna não encontrada, tentar sem os novos campos
      if (columnError.message && columnError.message.includes('column')) {
        console.log('Colunas turma/idade/sexo não encontradas, usando inserção básica');
        result = await pool.query(
          'INSERT INTO users (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo, data_criacao',
          [nome, email, hashedPassword, tipo || 'aluno']
        );
      } else {
        throw columnError;
      }
    }

    const user = result.rows[0];

    // Criar registro inicial de pontuação
    await pool.query(
      'INSERT INTO scores (user_id, pontos_totais, nivel) VALUES ($1, 0, $2)',
      [user.id, 'iniciante']
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    // Retornar mensagem de erro mais específica
    const errorMessage = error.message || 'Erro ao cadastrar usuário';
    res.status(500).json({ error: errorMessage });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const user = result.rows[0];

    // Verificar senha
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Buscar pontuação
    const scoreResult = await pool.query('SELECT * FROM scores WHERE user_id = $1', [user.id]);
    const score = scoreResult.rows[0] || { pontos_totais: 0, nivel: 'iniciante' };

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        pontos_totais: score.pontos_totais,
        nivel: score.nivel
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query('SELECT id, nome, email, tipo, turma, idade, sexo, data_criacao FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = userResult.rows[0];
    const scoreResult = await pool.query('SELECT * FROM scores WHERE user_id = $1', [id]);
    const score = scoreResult.rows[0] || { pontos_totais: 0, nivel: 'iniciante' };

    res.json({
      ...user,
      pontos_totais: score.pontos_totais,
      nivel: score.nivel
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

module.exports = {
  register,
  login,
  getUserById
};
