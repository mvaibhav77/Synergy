import express from "express";
import passport from "passport";
import generateToken from "../utils/generateToken.js";

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
      `http://localhost:3000/login-success?` +
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

    console.log(redirectLink);
    res.redirect(redirectLink);
  }
);

export default router;
