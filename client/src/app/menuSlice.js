import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false };

const menuSlice = createSlice({
  name: "menuState",
  initialState,
  reducers: {
    setMenuState: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { setMenuState } = menuSlice.actions;

export default menuSlice.reducer;
