import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false, messages: [] };

const forwardMssgMenuSlice = createSlice({
  name: "forwardMssgMenuState",
  initialState,
  reducers: {
    setForwardMssgMenuState: (state, action) => {
      const { open, messages } = action.payload;

      state.open = open;
      state.messages = messages;
    },
  },
});

export const { setForwardMssgMenuState } = forwardMssgMenuSlice.actions;

export default forwardMssgMenuSlice.reducer;
