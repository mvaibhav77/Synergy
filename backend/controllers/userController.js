import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

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
    // socialMedia,
    connectionPreferences,
  } = req.body;

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
    skills,
    location,
    interests,
    profession, // Save profession in user profile
    avatar,
    // socialMedia,
    connectionPreferences,
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
      profession: user.profession, // Return profession in response
      avatar: user.avatar,
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

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;
    user.location = req.body.location || user.location;
    user.interests = req.body.interests || user.interests;
    user.profession = req.body.profession || user.profession; // Update profession
    user.avatar = req.body.avatar || user.avatar;
    user.socialMedia = req.body.socialMedia || user.socialMedia;
    user.connectionPreferences =
      req.body.connectionPreferences || user.connectionPreferences;

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

// @desc   Get user by ID
// route   GET /api/users/:id
// @access Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

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

  res.status(200).json({ message: "Connection request sent" });
});

// @desc   Approve connection request
// route   POST /api/users/:id/approve
// @access Private
const approveConnectionRequest = asyncHandler(async (req, res) => {
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

  // Update the status to "connected"
  currentConnection.status = "connected";

  // Update the connection on the target user's side
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

  res.status(200).json({ message: "Connection request approved" });
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

  res.status(200).json({ message: "Connection request rejected" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUser,
  sendConnectionRequest,
  rejectConnectionRequest,
  approveConnectionRequest,
};
