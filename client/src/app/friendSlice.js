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
        let day = null;

        messages.map((item, index) => {
          const itemDate = new Date(item.date);

          if (day !== itemDate.getDate()) {
            day = itemDate.getDate();

            return (state.messages[index] = Object.assign(
              { newDay: true },
              item
            ));
          }

          return (state.messages[index] = Object.assign(
            { newDay: false },
            item
          ));
        });
      } else {
        state.messages = [];
      }

      state.conversationId = conversationId;
      state.areFriends = friend && friend.areFriends ? friend.areFriends : null;
    },
  },
});

export const { setFriendData } = friendSlice.actions;

export default friendSlice.reducer;
