import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const allLoadsSlice = createSlice({
  name: "allLoadsState",
  initialState,
  reducers: {
    setFriendListLoad: (state, action) => {
      state.friendListLoaded = true;
    },
    setChangeAddFriendModeLoaded: (state, action) => {
      state.addFriendModeLoaded = action.payload;
    },
  },
});

export const { setChangeAddFriendModeLoaded, setFriendListLoad } =
  allLoadsSlice.actions;

export default allLoadsSlice.reducer;
