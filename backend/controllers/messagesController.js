const Message = require('../models/Message');

// Get messages by conversation
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('sender receiver');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, content } = req.body;
    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      receiver: receiverId,
      content,
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};