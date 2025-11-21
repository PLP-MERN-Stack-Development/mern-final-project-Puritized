import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import eventBus from "../utils/events.js";

/**
 * Create/Get a conversation between two users
 */
export const getOrCreateConversation = async (req, res, next) => {
  try {
    const { userId, otherUserId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, otherUserId],
        unreadCounts: {
          [userId]: 0,
          [otherUserId]: 0
        }
      });
    }

    res.json(conversation);
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch all user's conversations
 */
export const getUserConversations = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ lastMessageAt: -1 })
      .populate("participants", "name email role");

    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch messages in a conversation
 */
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversation: conversationId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

/**
 * Send a message (non-socket fallback)
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { sender, content, attachments = [] } = req.body;

    const msg = await Message.create({
      conversation: conversationId,
      sender,
      content,
      attachments,
    });

    // Update conversation metadata
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessageAt: new Date(),
      $inc: { [`unreadCounts.${sender}`]: 0 } // this sender does NOT increase unread
    });

    // Broadcast via event bus → socketServer.js listens
    eventBus.emit("chat:message", {
      conversationId,
      message: msg,
    });

    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
};

/**
 * Mark all messages in the conversation as read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCounts.${userId}`]: 0 },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};