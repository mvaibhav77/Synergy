import express from "express";
import passport from "passport";
import { protect } from "../middleware/authMiddleware.js";
import {
  authUser,
  registerUser,
  getUserProfile,
  logoutUser,
  updateUserProfile,
  sendConnectionRequest,
  rejectConnectionRequest,
  approveConnectionRequest,
  getUserById,
  disconnectUser,
} from "../controllers/userController.js";

const router = express.Router();

// Authentication routes
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);

// Protected routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/:id").get(protect, getUserById);
router.route("/:id/connect").post(protect, sendConnectionRequest);
router.route("/:id/approve").post(protect, approveConnectionRequest);
router.route("/:id/reject").post(protect, rejectConnectionRequest);
router.route("/:id/disconnect").post(protect, disconnectUser);

// GitHub OAuth routes (no `protect` middleware)
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }), // Redirect to home on failure
  (req, res) => {
    res.redirect("/profile"); // Redirect to profile or any other page on success
  }
);

export default router;
