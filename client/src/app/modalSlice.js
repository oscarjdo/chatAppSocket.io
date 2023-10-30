import { createSlice } from "@reduxjs/toolkit";

const initialState = { modalOpen: false };

const modalSlice = createSlice({
  name: "modalState",
  initialState,
  reducers: {
    setModalState: (state, action) => {
      const { open, func } = action.payload;

      state.func = func;
      state.modalOpen = open;
    },
  },
});

export const { setModalState } = modalSlice.actions;

export default modalSlice.reducer;
