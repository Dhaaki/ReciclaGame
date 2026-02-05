const express = require('express');
const router = express.Router();
const {
  getMetricsByTurma,
  getMetricsByIdade,
  getMetricsBySexo,
  getMetricsByMaterial,
  getGeneralStats,
  getTopTurmas
} = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

router.get('/turma', authenticateToken, getMetricsByTurma);
router.get('/idade', authenticateToken, getMetricsByIdade);
router.get('/sexo', authenticateToken, getMetricsBySexo);
router.get('/material', authenticateToken, getMetricsByMaterial);
router.get('/geral', authenticateToken, getGeneralStats);
router.get('/top-turmas', authenticateToken, getTopTurmas);

module.exports = router;
