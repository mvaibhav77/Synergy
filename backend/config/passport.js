import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import User from "../models/userModel.js"; // Adjust the path as needed
import dotenv from "dotenv";
import {
  GITHUB_REDIRECT_URI,
  LINKEDIN_REDIRECT_URI,
} from "../utils/constants.js";
import axios from "axios";

dotenv.config();

// GITHUB OAUTH
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_REDIRECT_URI,
      scope: ["user:email"], // Request email permission
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists by GitHub ID or email
        console.log(profile);
        let user = await User.findOne({
          $or: [
            { "socialMedia.userId": profile.id },
            { email: profile.emails[0]?.value },
          ],
        });

        if (user) {
          // User exists, update GitHub information
          const existingGithubAccount = user.socialMedia.find(
            (sm) => sm.platform === "github"
          );
          if (existingGithubAccount) {
            existingGithubAccount.username = profile.username;
            existingGithubAccount.accessToken = accessToken;
          } else {
            user.socialMedia.push({
              platform: "github",
              username: profile.username,
              userId: profile.id,
              accessToken,
            });
          }
          await user.save();
        } else {
          // User does not exist, create a new user
          user = new User({
            name: profile.displayName || profile.username,
            email: profile.emails[0]?.value, // Email from GitHub profile
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
        console.error("Error handling GitHub callback:", error); // Log errors
        return done(error, false);
      }
    }
  )
);

// LINKEDIN OAUTH
// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       callbackURL: LINKEDIN_REDIRECT_URI,
//       scope: ["openid", "profile", "email"], // OIDC scopes
//       state: true,
//     },
//     async (accessToken, refreshToken, params, profile, done) => {
//       try {
//         // Log tokens
//         console.log(profile);

//         // Step 1: Decode the ID Token (JWT)
//         // const decodedIDToken = jwt.decode(params.id_token);
//         // console.log("Decoded ID Token:", decodedIDToken);

//         // // Step 2: Optional - Fetch additional profile info via /userinfo endpoint
//         // const userInfoResponse = await axios.get(
//         //   "https://api.linkedin.com/v2/userinfo",
//         //   {
//         //     headers: {
//         //       Authorization: `Bearer ${accessToken}`,
//         //     },
//         //   }
//         // );
//         // const userInfo = userInfoResponse.data;
//         // console.log("User Info:", userInfo);

//         // // Step 3: Now handle user creation or updating based on the retrieved profile
//         // let user = await User.findOne({
//         //   $or: [
//         //     { "socialMedia.userId": decodedIDToken.sub }, // user ID from the token
//         //     { email: decodedIDToken.email },
//         //   ],
//         // });

//         // if (user) {
//         //   // Update LinkedIn account info
//         //   const existingLinkedInAccount = user.socialMedia.find(
//         //     (sm) => sm.platform === "linkedin"
//         //   );
//         //   if (existingLinkedInAccount) {
//         //     existingLinkedInAccount.username = decodedIDToken.name;
//         //     existingLinkedInAccount.accessToken = accessToken;
//         //   } else {
//         //     user.socialMedia.push({
//         //       platform: "linkedin",
//         //       username: decodedIDToken.name,
//         //       userId: decodedIDToken.sub,
//         //       accessToken,
//         //     });
//         //   }
//         //   await user.save();
//         // } else {
//         //   // Create a new user with LinkedIn profile data
//         //   user = new User({
//         //     name: decodedIDToken.name,
//         //     email: decodedIDToken.email,
//         //     socialMedia: [
//         //       {
//         //         platform: "linkedin",
//         //         username: decodedIDToken.name,
//         //         userId: decodedIDToken.sub,
//         //         accessToken,
//         //       },
//         //     ],
//         //   });
//         //   await user.save();
//         // }

//         // Step 4: Return the user data
//         return done(null, profile);
//       } catch (error) {
//         console.error("Error fetching LinkedIn profile:", error);
//         return done(error, false);
//       }
//     }
//   )
// );

// Serialize and deserialize user for session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Error deserializing user:", error); // Log errors
    done(error, null);
  }
});
