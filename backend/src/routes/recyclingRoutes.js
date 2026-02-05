const express = require('express');
const router = express.Router();
const { createRecord, getUserRecords } = require('../controllers/recyclingController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, createRecord);
router.get('/user/:userId', authenticateToken, getUserRecords);

module.exports = router;
