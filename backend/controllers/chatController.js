import asyncHandler from "express-async-handler";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

// @desc    Create a new conversation
// @route   POST /api/chat/conversations
// @access  Private
const createConversation = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  console.log(req.body);

  // Check if a conversation between the users already exists
  const existingConversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (existingConversation) {
    res.status(400);
    throw new Error("Conversation already exists");
  }

  // Create a new conversation
  const conversation = new Conversation({
    participants: [senderId, receiverId],
  });

  try {
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500);
    throw new Error("Server error, failed to create conversation");
  }
});

// @desc    Get all conversations for a user
// @route   GET /api/chat/conversations
// @access  Private
const getUserConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: { $in: [req.user._id] },
  }).populate("participants", "name email avatar");

  res.json(conversations);
});

// @desc    Get all messages for a conversation
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
const getConversationMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    conversation: req.params.id,
  }).populate("sender", "name email avatar");

  res.json(messages);
});

// @desc    Send message to a user
// @route   POST /api/chat/send
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, content } = req.body;

  // Find or create a conversation between the two users
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, recipientId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, recipientId],
    });
  }

  // Create a new message
  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    content,
  });

  // Update the conversation with the latest message
  conversation.lastMessage = message.content; // Optionally store the whole message object if needed
  await conversation.save();

  res.status(201).json(message);
});

export {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  createConversation,
};
