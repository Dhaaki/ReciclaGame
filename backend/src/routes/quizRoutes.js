const express = require('express');
const router = express.Router();
const { getQuizzes, answerQuiz } = require('../controllers/quizController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getQuizzes);
router.post('/answer', authenticateToken, answerQuiz);

module.exports = router;
