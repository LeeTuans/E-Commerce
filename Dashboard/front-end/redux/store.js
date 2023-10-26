import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { apiSlice } from "./apiSlice";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import productReducer from "./features/productSlide";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    user: userReducer,
    product: productReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
