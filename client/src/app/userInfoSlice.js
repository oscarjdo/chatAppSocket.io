import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false };

const userInfoSlice = createSlice({
  name: "userInfoState",
  initialState,
  reducers: {
    openUserInfo: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { openUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
