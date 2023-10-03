import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isScrolling: true,
};

const isScrollingSlice = createSlice({
  name: "isScrollingState",
  initialState,
  reducers: {
    setIsScrolling: (state, action) => {
      state.isScrolling = action.payload;
    },
  },
});

export const { setIsScrolling } = isScrollingSlice.actions;

export default isScrollingSlice.reducer;
