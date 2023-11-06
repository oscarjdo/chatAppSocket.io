import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: undefined,
  email: undefined,
  messages: [],
};

const friendSlice = createSlice({
  name: "friendState",
  initialState,
  reducers: {
    setFriendData: (state, action) => {
      const { friend, messages, conversationId, areFriends } = action.payload;

      state.conversationId = conversationId;
      state.areFriends = areFriends;

      for (const it in friend) {
        state[it] = friend[it];
      }

      if (messages && messages.length > 0) {
        state.messages = [];
        messages.map((item, index) => {
          state.messages[index] = item;
        });
      } else {
        state.messages = [];
      }
    },
  },
});

export const { setFriendData } = friendSlice.actions;

export default friendSlice.reducer;
