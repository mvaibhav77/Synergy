import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Recipient of the notification
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who triggered the notification (e.g., who sent the request)
    type: {
      type: String,
      enum: ["connection_request", "request_approved", "request_rejected"],
      required: true,
    },
    message: { type: String, required: true }, // Notification message
    isRead: { type: Boolean, default: false }, // Whether the notification has been read
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
