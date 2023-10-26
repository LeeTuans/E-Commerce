import { createSlice } from "@reduxjs/toolkit";

const initialState = { token: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      const { accessToken } = action.payload;
      localStorage.setItem("token", accessToken);
      state.token = accessToken;
    },
    logOut: () => {
      localStorage.removeItem("token");
      return initialState;
    },
  },
});

export const { setToken, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
