import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import queryString from "query-string";

const GitHubCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract all user info from query params
    const params = queryString.parse(window.location.search);

    const userData = {
      _id: params.id,
      name: params.name,
      email: params.email,
      username: params.username,
      bio: params.bio,
      skills: params.skills ? JSON.parse(params.skills) : [],
      location: params.location,
      interests: params.interests ? JSON.parse(params.interests) : [],
      profession: params.profession,
      avatar: params.avatar,
      socialMedia: params.socialMedia ? JSON.parse(params.socialMedia) : [],
      connections: params.connections ? JSON.parse(params.connections) : [],
      connectionPreferences: params.connectionPreferences
        ? JSON.parse(params.connectionPreferences)
        : {},
      lastActive: params.lastActive,
    };

    // Dispatch the setCredentials action to save user info in Redux
    dispatch(setCredentials(userData));

    // Redirect user to the desired page after login
    navigate("/profile");
  }, []);

  return <div>Logging in with GitHub...</div>;
};

export default GitHubCallback;
