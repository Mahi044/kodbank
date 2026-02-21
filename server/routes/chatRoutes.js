const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { chat } = require('../controllers/chatController');

// POST /api/chat — Send a message to the AI chatbot
router.post('/chat', verifyToken, chat);

module.exports = router;
