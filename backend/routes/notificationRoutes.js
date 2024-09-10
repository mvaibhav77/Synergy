import express from "express";
import Notification from "../models/notificationModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc   Fetch user notifications
// route   GET /api/notifications
// @access Private
router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10); // Limit to last 10 notifications

  res.json(notifications);
});

// @desc   Mark notifications as read
// route   PUT /api/notifications/:id/read
// @access Private
router.put("/:id/read", protect, async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // Only the owner of the notification can mark it as read
  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  notification.isRead = true;
  await notification.save();

  res.json({ message: "Notification marked as read" });
});

export default router;
