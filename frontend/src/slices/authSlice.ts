import { Conversation, UserInfo } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of your userInfo object based on the Mongoose schema

interface AuthState {
  userInfo: UserInfo | null;
  connections: UserInfo[] | null;
  conversations: Conversation[] | null;
}

const initialState: AuthState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
  connections: localStorage.getItem("connections")
    ? JSON.parse(localStorage.getItem("connections") as string)
    : null,
  conversations: localStorage.getItem("conversations")
    ? JSON.parse(localStorage.getItem("conversations") as string)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    setConnections: (state, action: PayloadAction<UserInfo[]>) => {
      state.connections = action.payload;
      localStorage.setItem("connections", JSON.stringify(action.payload));
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      localStorage.setItem("conversations", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      state.connections = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("connections");
      localStorage.removeItem("conversations");
    },
  },
});

export const { setCredentials, setConnections, setConversations, logout } =
  authSlice.actions;

export default authSlice.reducer;
