const express = require('express');
const router = express.Router();
const { getBalance, getProfile } = require('../controllers/balanceController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/balance', verifyToken, getBalance);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
