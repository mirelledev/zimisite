import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import postReducer from "./slices/postSlice";

export const storeConfig = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
  },
});

export type RootState = ReturnType<typeof storeConfig.getState>;
export type AppDispatch = typeof storeConfig.dispatch;
