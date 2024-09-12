import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getConversationMessages,
  getUserConversations,
  sendMessage,
  createConversation,
} from "../controllers/chatController.js";

const router = express.Router();

router
  .route("/conversations")
  .get(protect, getUserConversations)
  .post(protect, createConversation);
router.get("/conversations/:id/messages", protect, getConversationMessages);
router.post("/send", protect, sendMessage);

export default router;
