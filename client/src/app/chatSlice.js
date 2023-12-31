import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const chatSlice = createSlice({
  name: "chatState",
  initialState,
  reducers: {
    changeChatState: (state, action) => {
      state.open = action.payload.active;
      state.friendId = action.payload.friendId;
    },
  },
});

export const { changeChatState } = chatSlice.actions;

export default chatSlice.reducer;
