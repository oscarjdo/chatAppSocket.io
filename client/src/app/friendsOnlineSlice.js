import { createSlice } from "@reduxjs/toolkit";

const initialState = { list: {} };

const friendsOnlineSlice = createSlice({
  name: "friendsOnlineState",
  initialState,
  reducers: {
    setFriendsOnline: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setFriendsOnline } = friendsOnlineSlice.actions;

export default friendsOnlineSlice.reducer;
