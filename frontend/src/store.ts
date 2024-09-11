import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/slices/authSlice";
import recommendReducer from "./slices/recommendSlice";
import { apiSlice } from "@/slices/apiSlice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    recommend: recommendReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;
