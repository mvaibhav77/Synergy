import asyncHandler from "express-async-handler";
import computeCosineSimilarity from "../utils/computeSimilarity.js";
import User from "../models/userModel.js";
import { RECOMMEND_USERS_LIMIT } from "../utils/constants.js";

// @desc   Auth user/set token
// route   POST /api/users/auth
// @access Public
const recommendUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming user is authenticated through middleware

  // Fetch the current user's profile
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Extract connected user IDs
  const connectedUserIds = currentUser.connections
    .filter((conn) => conn.status === "connected")
    .map((conn) => conn.userId.toString());

  // Fetch all other users excluding the current user and connected users
  const allUsers = await User.find({
    _id: { $ne: userId, $nin: connectedUserIds },
  });

  // Calculate similarity for each user
  const recommendations = await Promise.all(
    allUsers.map(async (otherUser) => {
      const similarity = await computeCosineSimilarity(currentUser, otherUser);
      return { user: otherUser, similarity };
    })
  );

  // Sort recommendations by the highest similarity score
  recommendations.sort((a, b) => b.similarity - a.similarity);

  // Return top 10 recommendations (or fewer if less than 10 users are available)
  res.json(
    recommendations.slice(0, RECOMMEND_USERS_LIMIT).map(({ user, similarity }) => ({
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
      similarityScore: similarity, // Include similarity score
    }))
  );
});

export { recommendUsers };
