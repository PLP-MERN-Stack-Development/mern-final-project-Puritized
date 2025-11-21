const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMessages, sendMessage } = require('../controllers/messagesController');

// Fetch messages by conversation
router.get('/:conversationId', protect, getMessages);

// Send a new message
router.post('/', protect, sendMessage);

module.exports = router;