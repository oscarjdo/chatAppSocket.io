import { createSlice } from "@reduxjs/toolkit";

const initialState = { active: false };

const infoSlice = createSlice({
  name: "infoState",
  initialState,
  reducers: {
    activateInfo: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { activateInfo } = infoSlice.actions;

export default infoSlice.reducer;
