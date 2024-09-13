import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import queryString from "query-string";
import { UserInfo } from "@/utils/types";

const GitHubCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  type Params = {
    id?: string;
    name?: string;
    email?: string;
    username?: string;
    bio?: string;
    skills?: string;
    location?: string;
    interests?: string;
    profession?: string;
    avatar?: string;
    socialMedia?: string;
    connections?: string;
    connectionPreferences?: string;
    lastActive?: string;
  };

  useEffect(() => {
    // Prevent the effect from running if query string is empty
    if (!window.location.search) return;

    // Extract all user info from query params
    const params: Params = queryString.parse(window.location.search);

    // Prevent empty overwrites if the data is already populated
    if (!params.id) return;

    // Decode query parameters where needed
    const userData: UserInfo = {
      _id: params.id || "",
      name: decodeURIComponent(params.name || ""),
      email: decodeURIComponent(params.email || ""),
      username: params.username,
      bio: decodeURIComponent(params.bio || ""),
      skills: params.skills
        ? JSON.parse(decodeURIComponent(params.skills))
        : [],
      location: decodeURIComponent(params.location || ""),
      interests: params.interests
        ? JSON.parse(decodeURIComponent(params.interests))
        : [],
      profession: decodeURIComponent(params.profession || ""),
      avatar: decodeURIComponent(params.avatar || ""),
      socialMedia: params.socialMedia
        ? JSON.parse(decodeURIComponent(params.socialMedia))
        : [],
      connections: params.connections
        ? JSON.parse(decodeURIComponent(params.connections))
        : [],
      connectionPreferences: params.connectionPreferences
        ? JSON.parse(decodeURIComponent(params.connectionPreferences))
        : {},
      lastActive: params.lastActive
        ? new Date(decodeURIComponent(params.lastActive))
        : new Date(),
    };

    // Dispatch the setCredentials action to save user info in Redux
    dispatch(setCredentials(userData));

    // Redirect user to the desired page after login
    navigate("/", { replace: true }); // Add { replace: true } to prevent history from keeping the GitHub callback URL
  }, [dispatch, navigate]);

  return <div>Logging in with GitHub...</div>;
};

export default GitHubCallback;
