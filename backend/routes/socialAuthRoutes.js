import express from "express";
import axios from "axios";
import passport from "passport";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// GitHub OAuth routes (no `protect` middleware)
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }), // Redirect to home on failure
  (req, res) => {
    // Ensure the user is authenticated and exists in req.user
    if (!req.user) {
      return res.status(400).json({ message: "Authentication failed" });
    }

    generateToken(res, req.user._id);

    const redirectLink =
      `${process.env.APP_URL}/login-success?` +
      `id=${req.user._id}&name=${encodeURIComponent(req.user.name)}&` +
      `email=${encodeURIComponent(
        req.user.email
      )}&username=${encodeURIComponent(req.user.username)}&` +
      `bio=${encodeURIComponent(req.user.bio)}&skills=${encodeURIComponent(
        JSON.stringify(req.user.skills)
      )}&` +
      `location=${encodeURIComponent(req.user.location)}&` +
      `interests=${encodeURIComponent(JSON.stringify(req.user.interests))}&` +
      `profession=${encodeURIComponent(req.user.profession)}&` +
      `avatar=${encodeURIComponent(
        req.user.avatar
      )}&socialMedia=${encodeURIComponent(
        JSON.stringify(req.user.socialMedia)
      )}&` +
      `connections=${encodeURIComponent(
        JSON.stringify(req.user.connections)
      )}&` +
      `connectionPreferences=${encodeURIComponent(
        JSON.stringify(req.user.connectionPreferences)
      )}&` +
      `lastActive=${encodeURIComponent(
        new Date(req.user.lastActive).toISOString()
      )}`; // Ensure lastActive is in ISO format

    res.redirect(redirectLink);
  }
);

// LinkedIn OAuth routes
router.get("/linkedin", (req, res) => {
  const redirectUri = encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI);
  const scope = encodeURIComponent("openid profile email");
  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;

  res.redirect(linkedinAuthUrl);
});

router.get("/linkedin/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing code parameter");
  }

  try {
    // Step 1: Exchange code for access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Step 2: Fetch user profile info from userinfo endpoint
    const userInfoResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const profileData = userInfoResponse.data;

    // Step 3: Handle user creation or updating in your database
    let user = await User.findOne({ email: profileData.email }); // Assuming `email` is available in profileData

    if (user) {
      // Update avatar if it is empty
      if (!user.avatar) {
        user.avatar = profileData.picture; // Set LinkedIn profile picture
      }
      user.linkedInId = profileData.sub;
      user.locale = profileData.locale;
      // Check if the LinkedIn entry already exists
      const linkedInEntryExists = user.socialMedia.some(
        (social) =>
          social.platform === "linkedin" && social.userId === profileData.sub
      );

      // If it doesn't exist, add the new LinkedIn social media entry
      if (!linkedInEntryExists) {
        user.socialMedia.push({
          platform: "linkedin",
          userId: profileData.sub,
          accessToken,
        });
      }

      await user.save();
    } else {
      // Create new user
      user = new User({
        name: profileData.name,
        email: profileData.email, // Assuming email is present in profileData
        socialMedia: [
          {
            platform: "linkedin",
            userId: profileData.sub,
            accessToken,
          },
        ],
        avatar: profileData.picture,
        linkedInId: profileData.sub,
        locale: profileData.locale,
      });
      await user.save();
    }

    // Generate JWT or handle session as needed
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    generateToken(res, user._id);

    // Redirect or respond with token
    res.redirect(
      `${process.env.APP_URL}/api/auth/linkedin/login-success?token=${token}`
    );
  } catch (error) {
    console.error("LinkedIn auth error:", error);
    return res.status(500).send("Authentication failed");
  }
});

router.get("/linkedin/login-success", async (req, res) => {
  const { token } = req.query;
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId; // Extract the userId from the token
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).send("Invalid token");
  }

  // Fetch the user from the database
  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).send("User not found");
  }

  // Construct the redirect link with user info
  const redirectLink =
    `${process.env.APP_URL}/login-success?` +
    `id=${user._id}&name=${encodeURIComponent(user.name)}&` +
    `email=${encodeURIComponent(user.email)}&username=${encodeURIComponent(
      user.username || ""
    )}&` + // Fallback for optional fields
    `bio=${encodeURIComponent(user.bio || "")}&` + // Fallback for optional fields
    `skills=${encodeURIComponent(JSON.stringify(user.skills || []))}&` + // Fallback for optional fields
    `location=${encodeURIComponent(user.location || "")}&` + // Fallback for optional fields
    `interests=${encodeURIComponent(JSON.stringify(user.interests || []))}&` + // Fallback for optional fields
    `profession=${encodeURIComponent(user.profession || "")}&` + // Fallback for optional fields
    `avatar=${encodeURIComponent(user.avatar || "")}&` + // Fallback for optional fields
    `socialMedia=${encodeURIComponent(
      JSON.stringify(user.socialMedia || [])
    )}&` + // Fallback for optional fields
    `connections=${encodeURIComponent(
      JSON.stringify(user.connections || [])
    )}&` + // Fallback for optional fields
    `connectionPreferences=${encodeURIComponent(
      JSON.stringify(user.connectionPreferences || {})
    )}&` + // Fallback for optional fields
    `lastActive=${encodeURIComponent(new Date(user.lastActive).toISOString())}`; // Ensure lastActive is in ISO format

  // Redirect to the constructed link
  res.redirect(redirectLink);
});

export default router;
