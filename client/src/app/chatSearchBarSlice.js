import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false };

const chatSearchBarSlice = createSlice({
  name: "chatSearchBarState",
  initialState,
  reducers: {
    setChatSearchBarState: (state, action) => {
      const { open } = action.payload;

      state.open = open;
    },
  },
});

export const { setChatSearchBarState } = chatSearchBarSlice.actions;

export default chatSearchBarSlice.reducer;
