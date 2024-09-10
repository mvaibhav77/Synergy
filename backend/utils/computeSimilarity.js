import axios from "axios";

const fetchGithubReposCount = async (username) => {
  try {
    // Fetch user details using GitHub API
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    // Return the public repository count
    return response.data.public_repos;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return 0; // If there's an error, assume 0 repositories
  }
};

const githubSimilarity = async (userA, userB) => {
  const githubA = userA.socialMedia?.find((sm) => sm.platform === "github");
  const githubB = userB.socialMedia?.find((sm) => sm.platform === "github");

  // If either user doesn't have a GitHub account, return 0
  if (!githubA || !githubB) return 0;

  // Fetch repository counts
  const reposCountA = await fetchGithubReposCount(githubA.username);
  const reposCountB = await fetchGithubReposCount(githubB.username);

  // Calculate similarity based on repository count
  const maxReposCount = Math.max(reposCountA, reposCountB);
  return maxReposCount ? Math.min(reposCountA, reposCountB) / maxReposCount : 0;
};
const skillSimilarity = (userA, userB) => {
  const skillsA = userA.skills || [];
  const skillsB = userB.skills || [];

  // Create frequency maps for skills
  const skillMapA = {};
  const skillMapB = {};

  skillsA.forEach((skill) => (skillMapA[skill] = (skillMapA[skill] || 0) + 1));
  skillsB.forEach((skill) => (skillMapB[skill] = (skillMapB[skill] || 0) + 1));

  // Get all unique skills
  const allSkills = new Set([...skillsA, ...skillsB]);

  // Create vectors for cosine similarity
  const vectorA = [];
  const vectorB = [];

  allSkills.forEach((skill) => {
    vectorA.push(skillMapA[skill] || 0);
    vectorB.push(skillMapB[skill] || 0);
  });

  // Compute cosine similarity
  const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
  const magnitudeA = Math.sqrt(
    vectorA.reduce((sum, val) => sum + val * val, 0)
  );
  const magnitudeB = Math.sqrt(
    vectorB.reduce((sum, val) => sum + val * val, 0)
  );

  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

const interestSimilarity = (userA, userB) => {
  // Handle cases where interests might be undefined or empty
  const interestsA = userA.connectionPreferences.interests || [];
  const interestsB = userB.interests || [];

  if (interestsA.length === 0 || interestsB.length === 0) return 0; // If either has no interests, return 0

  const commonInterests = interestsA.filter((interest) =>
    interestsB.includes(interest)
  );
  return (
    commonInterests.length / Math.max(interestsA.length, interestsB.length)
  );
};

const locationMatch = (userA, userB) => {
  // Handle cases where location might be missing
  if (!userA.location || !userB.location) return 0; // If either has no location, return 0
  return userA.location === userB.location ? 1 : 0;
};

const professionSimilarity = (userA, userB) => {
  // Handle cases where profession might be missing
  if (!userA.profession || !userB.profession) return 0; // If either has no profession, return 0
  return userA.profession === userB.profession ? 1 : 0;
};

// using cosine similarity to compute similarity between two users
const computeUserSimilarity = async (userA, userB) => {
  const skillScore = skillSimilarity(userA, userB); // Example weight: 20%
  const interestScore = interestSimilarity(userA, userB); // Example weight: 30%
  const locationScore = locationMatch(userA, userB); // Example weight: 10%
  const professionScore = professionSimilarity(userA, userB); // Example weight: 20%
  const githubScore = await githubSimilarity(userA, userB); // Example weight: 20%

  console.log(
    `Skill score: ${skillScore}, Interest score: ${interestScore}, Location score: ${locationScore}, Profession score: ${professionScore}, GitHub score: ${githubScore}`
  );

  // Composite similarity score
  return (
    0.2 * skillScore +
    0.3 * interestScore +
    0.1 * locationScore +
    0.2 * professionScore +
    0.2 * githubScore
  );
};

export default computeUserSimilarity;
