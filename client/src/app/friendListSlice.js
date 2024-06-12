import { createSlice } from "@reduxjs/toolkit";

const initialState = { list: [] };

const friendListSlice = createSlice({
  name: "friendListState",
  initialState,
  reducers: {
    setFriendListState: (state, action) => {
      const { list } = action.payload;

      state.list = list;
    },
  },
});

export const { setFriendListState } = friendListSlice.actions;

export default friendListSlice.reducer;
