const express = require('express');
const router = express.Router();
const { getBalance } = require('../controllers/balanceController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/balance', verifyToken, getBalance);

module.exports = router;
