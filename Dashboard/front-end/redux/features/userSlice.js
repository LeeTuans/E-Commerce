import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  me: null,
  users: null,
  count: null,
};

export const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    setMe: (state, action) => {
      state.me = action.payload;
    },
    setUserData: (state, action) => {
      state.users = action.payload.users;
      state.count = action.payload.count;
    },
  },
});

export default userSlice.reducer;

export const { setMe, setUserData } = userSlice.actions;
