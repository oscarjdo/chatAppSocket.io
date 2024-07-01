import { createSlice } from "@reduxjs/toolkit";

const initialState = { to: null };

const scrollToSlice = createSlice({
  name: "scrollToState",
  initialState,
  reducers: {
    setScrollToState: (state, action) => {
      const { to, time } = action.payload;
      state.to = to;
      state.time = time;
    },
  },
});

export const { setScrollToState } = scrollToSlice.actions;

export default scrollToSlice.reducer;
