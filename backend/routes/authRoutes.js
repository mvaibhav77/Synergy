import express from "express";
import passport from "passport";

const router = express.Router();

// @desc   Redirect to GitHub for authentication
// @route  GET /api/auth/github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// @desc   GitHub OAuth callback
// @route  GET /api/auth/github/callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    successRedirect: "/", // Redirect to homepage after successful login
  })
);

export default router;
