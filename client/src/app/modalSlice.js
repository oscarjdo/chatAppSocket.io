import { createSlice } from "@reduxjs/toolkit";

const initialState = { modalOpen: false, messages: null };

const modalSlice = createSlice({
  name: "modalState",
  initialState,
  reducers: {
    setModalState: (state, action) => {
      const { open } = action.payload;

      state.modalOpen = open;
    },
  },
});

export const { setModalState } = modalSlice.actions;

export default modalSlice.reducer;
