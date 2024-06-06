import { createSlice } from "@reduxjs/toolkit";

const initialState = { selected: false, messages: {} };

const messageSelectSlice = createSlice({
  name: "messageSelectState",
  initialState,
  reducers: {
    selectMessage: (state, action) => {
      const { data, selected, unselect } = action.payload;

      if (unselect) {
        delete state.messages[data.message_id];
      } else if (!data) {
        state.messages = {};
      } else {
        state.messages = {
          ...state.messages,
          [data.message_id]: [
            data.file_url,
            data.sender,
            { isShown: data.is_show, featured: data.featured },
          ],
        };
      }
      state.selected = selected;
    },
  },
});

export const { selectMessage } = messageSelectSlice.actions;

export default messageSelectSlice.reducer;
