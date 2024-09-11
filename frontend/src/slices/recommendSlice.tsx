import { UserInfo } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of your userInfo object based on the Mongoose schema
interface RecommendSlice {
  recommendations: UserInfo[] | [];
}

const initialState: RecommendSlice = {
  recommendations: localStorage.getItem("recommendations")
    ? JSON.parse(localStorage.getItem("recommendations") as string)
    : null,
};

const recommendSlice = createSlice({
  name: "recommend",
  initialState,
  reducers: {
    setRecommendations: (state, action: PayloadAction<UserInfo[]>) => {
      state.recommendations = action.payload;
      localStorage.setItem("recommendations", JSON.stringify(action.payload));
    },
    rlogout: (state) => {
      state.recommendations = [];
      localStorage.removeItem("recommendations");
    },
  },
});

export const { setRecommendations, rlogout } = recommendSlice.actions;

export default recommendSlice.reducer;
