const pool = require('../config/database');
const { calculatePoints, getLevel } = require('../utils/gamification');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garantir que a pasta uploads existe
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'recycling-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif)'));
    }
  }
});

const createRecord = async (req, res) => {
  try {
    const { user_id, tipo_material, quantidade } = req.body;
    const foto_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!user_id || !tipo_material || !quantidade) {
      return res.status(400).json({ error: 'user_id, tipo_material e quantidade são obrigatórios' });
    }

    // Validar tipo de material
    const tiposValidos = ['papel', 'plástico', 'metal', 'vidro'];
    if (!tiposValidos.includes(tipo_material.toLowerCase())) {
      return res.status(400).json({ error: 'Tipo de material inválido' });
    }

    // Calcular pontos
    const pontosGerados = calculatePoints(tipo_material, parseInt(quantidade));

    // Inserir registro
    const result = await pool.query(
      `INSERT INTO recycling_records (user_id, tipo_material, quantidade, foto_url, pontos_gerados)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, tipo_material.toLowerCase(), quantidade, foto_url, pontosGerados]
    );

    // Atualizar pontuação total do usuário
    const scoreResult = await pool.query(
      'SELECT pontos_totais FROM scores WHERE user_id = $1',
      [user_id]
    );

    let pontosTotais = pontosGerados;
    if (scoreResult.rows.length > 0) {
      pontosTotais = scoreResult.rows[0].pontos_totais + pontosGerados;
    }

    // Determinar novo nível
    const novoNivel = getLevel(pontosTotais);

    // Atualizar ou criar score
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

    res.status(201).json({
      message: 'Registro de reciclagem criado com sucesso',
      record: result.rows[0],
      pontos_totais: pontosTotais,
      nivel: novoNivel
    });
  } catch (error) {
    console.error('Erro ao criar registro de reciclagem:', error);
    res.status(500).json({ error: 'Erro ao criar registro de reciclagem' });
  }
};

const getUserRecords = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT * FROM recycling_records 
       WHERE user_id = $1 
       ORDER BY data_registro DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
};

module.exports = {
  createRecord: [upload.single('foto'), createRecord],
  getUserRecords
};
