import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // First, find the user either by GitHub ID or by email
        let user = await User.findOne({
          $or: [
            { "socialMedia.userId": profile.id },
            { email: profile.emails[0].value },
          ],
        });

        if (user) {
          // User exists, update GitHub information
          user.socialMedia = {
            platform: "github",
            username: profile.username,
            userId: profile.id,
            accessToken,
          };
          await user.save();
        } else {
          // User does not exist, create a new user
          user = new User({
            name: profile.displayName || profile.username,
            email: profile.emails[0].value, // Email from GitHub profile
            socialMedia: [
              {
                platform: "github",
                username: profile.username,
                userId: profile.id,
                accessToken,
              },
            ],
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize and deserialize user for session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
