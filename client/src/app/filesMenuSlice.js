import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false };

const filesMenuSlice = createSlice({
  name: "filesMenuState",
  initialState,
  reducers: {
    setFilesMenuState: (state, action) => {
      const { open } = action.payload;

      state.open = open;
    },
  },
});

export const { setFilesMenuState } = filesMenuSlice.actions;

export default filesMenuSlice.reducer;
