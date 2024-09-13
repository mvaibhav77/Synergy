import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Notification from "../models/notificationModel.js";
import { generateWelcomeMessage } from "../utils/generation.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

// Helper function to parse array fields
const parseArrayField = (field) => {
  return Array.isArray(field) ? field : JSON.parse(field || "[]");
};

// @desc   Auth user/set token
// route   POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      skills: user.skills,
      location: user.location,
      interests: user.interests,
      profession: user.profession,
      avatar: user.avatar,
      socialMedia: user.socialMedia,
      connections: user.connections,
      connectionPreferences: user.connectionPreferences,
      lastActive: user.lastActive,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc   Register a new user
// route   POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    username,
    bio,
    skills,
    location,
    interests,
    profession, // Include profession in registration
    avatar,
    connectionPreferences,
  } = req.body;

  // Parse array fields if they are provided as strings
  const parsedSkills = Array.isArray(skills)
    ? skills
    : JSON.parse(skills || "[]");
  const parsedInterests = Array.isArray(interests)
    ? interests
    : JSON.parse(interests || "[]");
  const parsedConnectionPreferences = {
    interests: Array.isArray(connectionPreferences?.interests)
      ? connectionPreferences.interests
      : JSON.parse(connectionPreferences?.interests || "[]"),
    proximity: connectionPreferences?.proximity || null,
  };

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    username,
    bio,
    skills: parsedSkills,
    location,
    interests: parsedInterests,
    profession, // Save profession in user profile
    avatar,
    connectionPreferences: parsedConnectionPreferences,
    connections: [], // Initialize empty connections
    lastActive: Date.now(), // Set last active date
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      skills: user.skills,
      location: user.location,
      interests: user.interests,
      profession, // Return profession in response
      avatar,
      socialMedia: user.socialMedia,
      connections: user.connections,
      connectionPreferences: user.connectionPreferences,
      lastActive: user.lastActive,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc   Logout user
// route   POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User Logged Out" });
});

// @desc   Get user profile
// route   GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    username: req.user.username,
    bio: req.user.bio,
    skills: req.user.skills,
    location: req.user.location,
    interests: req.user.interests,
    profession: req.user.profession, // Include profession
    avatar: req.user.avatar,
    socialMedia: req.user.socialMedia,
    connections: req.user.connections,
    connectionPreferences: req.user.connectionPreferences,
    lastActive: req.user.lastActive,
  };

  res.status(200).json(user);
});

// @desc   Update user profile
// route   PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;

    // Check if fields are provided in request body before parsing
    user.skills = req.body.skills
      ? parseArrayField(req.body.skills)
      : user.skills;
    user.interests = req.body.interests
      ? parseArrayField(req.body.interests)
      : user.interests;
    user.location = req.body.location || user.location;

    user.profession = req.body.profession || user.profession; // Update profession
    user.avatar = req.body.avatar || user.avatar;
    user.socialMedia = req.body.socialMedia || user.socialMedia;

    // Parse and update nested objects if provided
    user.connectionPreferences = req.body.connectionPreferences
      ? {
          interests: req.body.connectionPreferences.interests
            ? parseArrayField(req.body.connectionPreferences.interests)
            : user.connectionPreferences.interests,
          proximity: req.body.connectionPreferences.proximity
            ? req.body.connectionPreferences.proximity
            : user.connectionPreferences.proximity,
        }
      : user.connectionPreferences;

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      location: updatedUser.location,
      interests: updatedUser.interests,
      profession: updatedUser.profession, // Include profession in the response
      avatar: updatedUser.avatar,
      socialMedia: updatedUser.socialMedia,
      connections: updatedUser.connections,
      connectionPreferences: updatedUser.connectionPreferences,
      lastActive: updatedUser.lastActive,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Get user by Id
// route   GET /api/users/:id
// @access Private
const getUserById = asyncHandler(async (req, res) => {
  let user = await User.findOne({ username: req.params.id }).select(
    "-password"
  );

  if (!user) {
    user = await User.findById(req.params.id).select("-password");
  }

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      skills: user.skills,
      location: user.location,
      profession: user.profession,
      interests: user.interests,
      socialMedia: user.socialMedia,
      avatar: user.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Send connection request
// route   POST /api/users/:id/connect
// @access Private
const sendConnectionRequest = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUser = req.user; // The authenticated user

  if (currentUser._id.toString() === targetUserId) {
    res.status(400);
    throw new Error("You cannot send a connection request to yourself.");
  }

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if the connection request already exists
  const existingConnection = currentUser.connections.find(
    (conn) => conn.userId.toString() === targetUserId
  );

  if (existingConnection) {
    res.status(400);
    throw new Error(
      "Connection request already sent or users already connected."
    );
  }

  // Add the connection to both users
  currentUser.connections.push({
    userId: targetUserId,
    status: "pending",
  });

  targetUser.connections.push({
    userId: currentUser._id,
    status: "pending",
  });

  await currentUser.save();
  await targetUser.save();

  // sending notifications
  const notification = await Notification.create({
    user: targetUser._id,
    sender: currentUser._id,
    type: "connection_request",
    message: `${currentUser.name} has sent you a connection request.`,
  });

  res.status(200).json({ message: "Connection request sent" });
});

// @desc   Approve connection request and send a welcome message
// route   POST /api/users/:id/approve
// @access Private
const approveConnectionRequest = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUser = req.user;

  // Fetch the target user
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the pending connection request from the target user
  const currentConnection = currentUser.connections.find(
    (conn) =>
      conn.userId.toString() === targetUserId && conn.status === "pending"
  );

  if (!currentConnection) {
    res.status(400);
    throw new Error("No pending connection request found");
  }

  // Update the status to "connected" for the current user
  currentConnection.status = "connected";
  currentConnection.connectedDate = new Date();

  // Update the connection status on the target user's side
  const targetConnection = targetUser.connections.find(
    (conn) =>
      conn.userId.toString() === currentUser._id.toString() &&
      conn.status === "pending"
  );

  if (targetConnection) {
    targetConnection.status = "connected";
  }

  await currentUser.save();
  await targetUser.save();

  // Generate a welcome message
  const messageContent = await generateWelcomeMessage(targetUser);

  // Check if a conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [currentUser._id, targetUser._id] },
  });

  if (!conversation) {
    // Create a new conversation if none exists
    conversation = new Conversation({
      participants: [targetUser._id, currentUser._id],
      lastMessage: messageContent,
    });
    await conversation.save();
  } else {
    // Update the last message for an existing conversation
    conversation.lastMessage = messageContent;
    await conversation.save();
  }

  // Send the welcome message
  const message = new Message({
    conversation: conversation._id,
    sender: targetUser._id,
    content: messageContent,
  });

  await message.save();

  // Send a notification
  await Notification.create({
    user: targetUser._id,
    sender: currentUser._id,
    type: "connection_request",
    message: `${currentUser.name} has approved your connection request.`,
  });

  res
    .status(200)
    .json({ message: "Connection request approved and message sent." });
});

// @desc   Reject connection request
// route   POST /api/users/:id/reject
// @access Private
const rejectConnectionRequest = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUser = req.user;

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find pending request from the target user
  const currentConnection = currentUser.connections.find(
    (conn) =>
      conn.userId.toString() === targetUserId && conn.status === "pending"
  );

  if (!currentConnection) {
    res.status(400);
    throw new Error("No pending connection request found");
  }

  // Update the status to "rejected"
  currentConnection.status = "rejected";

  // Update the connection on the target user's side
  const targetConnection = targetUser.connections.find(
    (conn) =>
      conn.userId.toString() === currentUser._id.toString() &&
      conn.status === "pending"
  );

  if (targetConnection) {
    targetConnection.status = "rejected";
  }

  await currentUser.save();
  await targetUser.save();

  // sending notifications
  const notification = await Notification.create({
    user: targetUser._id,
    sender: currentUser._id,
    type: "connection_request",
    message: `${currentUser.name} has rejected your connection request.`,
  });

  res.status(200).json({ message: "Connection request rejected" });
});

// @desc   Disconnect from a user
// route   POST /api/users/:id/disconnect
// @access Private
const disconnectUser = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUser = req.user;

  // Fetch the target user
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if a connection exists between the current user and the target user
  const currentConnectionIndex = currentUser.connections.findIndex(
    (conn) => conn.userId.toString() === targetUserId
  );

  const targetConnectionIndex = targetUser.connections.findIndex(
    (conn) => conn.userId.toString() === currentUser._id.toString()
  );

  if (currentConnectionIndex === -1 || targetConnectionIndex === -1) {
    res.status(400);
    throw new Error("No active connection found between users");
  }

  // Remove the connection from both users' connection lists
  currentUser.connections.splice(currentConnectionIndex, 1);
  targetUser.connections.splice(targetConnectionIndex, 1);

  await currentUser.save();
  await targetUser.save();

  // Optionally, delete the conversation history
  await Conversation.findOneAndDelete({
    participants: { $all: [currentUser._id, targetUser._id] },
  });

  // Send a notification (optional)
  await Notification.create({
    user: targetUser._id,
    sender: currentUser._id,
    type: "disconnection",
    message: `${currentUser.name} has disconnected from you.`,
  });

  res.status(200).json({ message: "Successfully disconnected from the user." });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  sendConnectionRequest,
  rejectConnectionRequest,
  approveConnectionRequest,
  disconnectUser,
};
