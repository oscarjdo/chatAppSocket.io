import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false };

const fileOpenSlice = createSlice({
  name: "fileOpenState",
  initialState,
  reducers: {
    setFileOpen: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { setFileOpen } = fileOpenSlice.actions;

export default fileOpenSlice.reducer;
