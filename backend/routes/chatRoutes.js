import express from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  getMessages,
  sendMessage,
  markAsRead,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/conversation", getOrCreateConversation);
router.get("/conversations/:userId", getUserConversations);

router.get("/:conversationId/messages", getMessages);
router.post("/:conversationId/messages", sendMessage);

router.post("/:conversationId/read", markAsRead);

export default router;