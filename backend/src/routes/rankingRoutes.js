const express = require('express');
const router = express.Router();
const { getRanking } = require('../controllers/rankingController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getRanking);

module.exports = router;
