import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import userRoutes from "./routes/userRoutes.js";
import AIRoutes from "./routes/AIRoutes.js";
import socialAuthRoutes from "./routes/socialAuthRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();

import "./config/passport.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// All routes
app.use("/api/users", userRoutes);
app.use("/api/auth", socialAuthRoutes);
app.use("/api", AIRoutes);

// Serve static files and handle frontend routing for production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("SERVER IS READY");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
