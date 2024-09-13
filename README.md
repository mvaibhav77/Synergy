# **Synergy : Ultimate Connector App**

**Overview:**

Synergy is a social networking platform designed to streamline professional connections and facilitate meaningful interactions. It leverages AI to suggest relevant connections, initiate conversations, and provide personalized recommendations.

**Product:**

Synergy is a platform that helps professionals connect, collaborate, and grow their networks. It offers features such as:

- **AI-powered recommendations:** Discover relevant connections based on your skills, interests, and network.
- **Confluence:** Expand your network by connecting with people in your contacts' networks.
- **Conversation starters:** Get AI-generated conversation topics to kickstart conversations.
- **Social features:** Share posts, engage in discussions, and build relationships.
- **Profile management:** Create and customize your profile to showcase your professional details.

**Motto:**

"Connect, Collaborate, Grow."

**Installation and Setup:**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/synergy.git
   ```

2. **Install dependencies:**

   ```bash
   cd backend
   pnpm install
   cd frontend
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<your_jwt_secret>
   GITHUB_CLIENT_ID=<your_github_client_id>
   GITHUB_CLIENT_SECRET=<your_github_client_secret>
   GEMINI_API_KEY=<your_gemini_api_key>
   ```

**Running the project:**

1. **Start the backend server:**

   ```bash
   cd backend
   pnpm dev
   ```

2. **Start the frontend development server:**

   ```bash
   cd frontend
   pnpm dev
   ```

**Project structure:**

```
synergy/
├── backend
│   ├── .env
│   ├── package.json
│   ├── src
│   │__  ├── ... (backend code)
├── frontend
│   ├── .env
│   ├── package.json
│   ├── src
│   │   ├── ... (frontend code)
│   └── tsconfig.json
└── README.md
```

**Additional notes:**

- Replace the placeholder values with your actual credentials.
- You can find instructions for obtaining GitHub OAuth credentials in GitHub's developer documentation.
- To run the backend and frontend separately, refer to the `scripts` section in the `package.json` files of the respective directories.
- For production deployment, you'll need to configure your environment variables accordingly and potentially use a production build for the frontend.
