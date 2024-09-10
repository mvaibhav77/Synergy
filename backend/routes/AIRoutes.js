import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { recommendUsers } from "../controllers/AIControllers.js";

const router = express.Router();

// recommendUsers route
router.route("/recommendations").get(protect, recommendUsers);

export default router;
