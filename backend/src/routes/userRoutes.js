const express = require('express');
const router = express.Router();
const { register, login, getUserById } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/:id', authenticateToken, getUserById);

module.exports = router;
