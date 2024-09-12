import cron from "node-cron";
import User from "../models/userModel.js"; // Adjust path as needed
import {
  sendConnectionRequest,
  recommendUsers,
} from "../actions/cronjobActions.js";
import { AUTOMATED_REQUEST_NUM } from "./constants.js";

// Function to fetch recommendations for a specific user
const getRecommendations = async (userId) => {
  // You may need to adjust this function based on how you fetch recommendations
  const user = await User.findById(userId);
  if (!user) {
    console.error(`User with ID ${userId} not found.`);
    return [];
  }

  // Simulate a call to the recommendations route
  const recommendations = recommendUsers(userId);
  return recommendations;
};

// Cron job to run daily at 1 AM
cron.schedule("0 1 * * *", async () => {
  console.log("Running daily connection request job...");
  console.log("---------------------------------------");

  try {
    // Fetch all users
    const users = await User.find();

    for (const user of users) {
      // Get recommendations for the user
      const recommendations = await getRecommendations(user._id);

      // Sort recommendations by similarity and take the top N
      const topRecommendations = recommendations
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, AUTOMATED_REQUEST_NUM);

      // Send connection requests concurrently using Promise.all
      await Promise.all(
        topRecommendations.map(async (recommendation) =>
          sendConnectionRequest(user._id, recommendation._id)
        )
      );
    }

    console.log("Connection request job completed successfully.");
  } catch (error) {
    console.error("Error running connection request job:", error);
  }
});
