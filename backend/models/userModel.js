import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: {
      type: String,
      required: function () {
        return !this.socialMedia || this.socialMedia.length === 0;
      }, // Password is required only if the user doesn't have a social media login
    },
    bio: { type: String },
    location: { type: String },
    skills: { type: [String] },
    profession: { type: String },
    interests: { type: [String] },
    avatar: { type: String }, // Profile image URL
    username: { type: String, unique: true }, // Public profile slug
    connections: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Connection user ID
          status: {
            type: String,
            enum: ["pending", "connected", "rejected"],
            default: "pending",
          },
          connectedDate: { type: Date, default: null }, // Optional connected date
        },
      ],
    },
    connectionPreferences: {
      interests: { type: [String] }, // Preferred matching interests
      proximity: { type: Number }, // Match users within this distance
    },
    socialMedia: {
      type: [
        {
          platform: { type: String, enum: ["github", "linkedin", "twitter"] },
          username: { type: String },
          userId: { type: String },
          accessToken: { type: String }, // Store OAuth tokens for API access
        },
      ],
    },
    lastActive: { type: Date, default: Date.now }, // Track last activity
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
