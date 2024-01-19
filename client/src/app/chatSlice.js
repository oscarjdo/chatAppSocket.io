import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const chatSlice = createSlice({
  name: "chatState",
  initialState,
  reducers: {
    changeChatState: (state, action) => {
      state.open = action.payload.active;
      state.userId = action.payload.userId;
      state.conversationId = action.payload.conversationId;
    },
  },
});

export const { changeChatState } = chatSlice.actions;

export default chatSlice.reducer;
