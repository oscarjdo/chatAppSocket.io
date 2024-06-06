import { createSlice } from "@reduxjs/toolkit";

const initialState = { type: null };

const sideMenusSlice = createSlice({
  name: "sideMenusState",
  initialState,
  reducers: {
    setSideMenusState: (state, action) => {
      const { type } = action.payload;

      state.type = type;
    },
  },
});

export const { setSideMenusState } = sideMenusSlice.actions;

export default sideMenusSlice.reducer;
