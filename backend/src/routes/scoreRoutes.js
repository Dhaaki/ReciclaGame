const express = require('express');
const router = express.Router();
const { getScoreByUserId } = require('../controllers/scoreController');
const { authenticateToken } = require('../middleware/auth');

router.get('/:userId', authenticateToken, getScoreByUserId);

module.exports = router;
