import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  areFriends: null,
  messages: [],
};

const friendSlice = createSlice({
  name: "friendState",
  initialState,
  reducers: {
    setFriendData: (state, action) => {
      const { friend, user, messages, conversationId, groupData } =
        action.payload;

      state.conversationId = conversationId;
      state.me = user;
      state.groupData = groupData;

      if (groupData && groupData.isGroup) {
        state.members = friend;
      } else {
        for (const it in friend) {
          state[it] = friend[it];
        }
      }

      if (messages && messages.length > 0) {
        state.messages = [];
        messages.map((item, index) => {
          state.messages[index] = item;
        });
      } else {
        state.messages = [];
      }

      state.areFriends = friend && friend.areFriends ? friend.areFriends : null;
    },
  },
});

export const { setFriendData } = friendSlice.actions;

export default friendSlice.reducer;
