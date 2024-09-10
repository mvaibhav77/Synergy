import User from "../models/userModel.js";
import { RECOMMEND_USERS_LIMIT } from "../utils/constants.js";
import computeCosineSimilarity from "../utils/computeSimilarity.js";

async function sendConnectionRequest(fromUserId, toUserId) {
  try {
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) {
      throw new Error("One or both users not found.");
    }

    // Validate user IDs
    if (fromUser._id.toString() === toUser._id.toString()) {
      throw new Error("You cannot send a connection request to yourself.");
    }

    // Check if connection already exists
    const existingConnection = fromUser.connections.find(
      (conn) => conn.userId.toString() === toUser._id.toString()
    );

    if (existingConnection) {
      throw new Error(
        "Connection request already sent or users already connected."
      );
    }

    // Update both user connections (assuming connections are defined in the user model)
    fromUser.connections.push({
      userId: toUser._id,
      status: "pending",
    });

    toUser.connections.push({
      userId: fromUser._id,
      status: "pending",
    });

    // Update both user documents in the database
    await User.updateOne({ _id: fromUser._id }, fromUser);
    await User.updateOne({ _id: toUser._id }, toUser);

    console.log("Connection request sent successfully."); // Return success message
  } catch (error) {
    console.error("Error sending connection request:", error);
    throw error; // Re-throw the error for further handling
  }
}

const recommendUsers = async (userId) => {
  // Fetch the current user's profile
  const currentUser = await User.findById(userId);
  if (!currentUser) {
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

  // Calculate similarity for each user with error handling
  const recommendations = await Promise.all(
    allUsers.map(async (otherUser) => {
      try {
        const similarity = await computeCosineSimilarity(
          currentUser,
          otherUser
        );
        return { user: otherUser, similarity };
      } catch (error) {
        console.error(
          `Error calculating similarity for user ${otherUser._id}`,
          error
        );
        // You can choose to return a default value or skip this user (optional)
        return { user: otherUser, similarity: 0 }; // Example of handling error
      }
    })
  );

  // Sort recommendations by the highest similarity score
  recommendations.sort((a, b) => b.similarity - a.similarity);

  // Return top 10 recommendations (or fewer if less than 10 users are available)
  return recommendations
    .slice(0, RECOMMEND_USERS_LIMIT)
    .map(({ user, similarity }) => ({
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
    }));
};

export { sendConnectionRequest, recommendUsers };
