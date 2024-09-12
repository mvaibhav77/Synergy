import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
// import User from "../models/userModel.js";

export const handleChat = (socket, io) => {
  // Join a specific conversation room
  socket.on("joinConversation", async ({ conversationId, userId }) => {
    try {
      // Check if the conversation exists
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        console.error(`Conversation ${conversationId} not found`);
        return;
      }

      // Check if the user is a participant in this conversation
      const isParticipant = conversation.participants.includes(userId);

      if (!isParticipant) {
        console.error(`User ${userId} is not part of the conversation`);
        return;
      }

      socket.join(conversationId);
      console.log(`User ${userId} joined conversation: ${conversationId}`);
    } catch (error) {
      console.error("Error joining conversation:", error);
    }
  });

  // Listen for new messages
  socket.on("sendMessage", async ({ conversationId, senderId, content }) => {
    try {
      // Check if the conversation exists
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        console.error(`Conversation ${conversationId} not found`);
        return;
      }

      // Check if the sender is part of the conversation
      const isParticipant = conversation.participants.includes(senderId);

      if (!isParticipant) {
        console.error(`Sender ${senderId} is not part of the conversation`);
        return;
      }

      // Create the message
      const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        content,
      });

      // Emit the new message to the conversation room
      io.to(conversationId).emit("newMessage", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};
