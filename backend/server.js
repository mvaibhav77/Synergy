import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import AIRoutes from "./routes/AIRoutes.js";
import socialAuthRoutes from "./routes/socialAuthRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { handleChat } from "./socket/chatHandler.js";

dotenv.config();

import "./config/cronjobs.js";
import "./config/passport.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// SOCKET IO SETUP
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*", // Allow cross-origin requests
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  handleChat(socket, io);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

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
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);
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

server.listen(port, () => console.log(`Server running on port ${port}`));
