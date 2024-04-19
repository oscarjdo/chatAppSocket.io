import { createSlice } from "@reduxjs/toolkit";

const initialState = { modalOpen: false, type: null };

const modalSlice = createSlice({
  name: "modalState",
  initialState,
  reducers: {
    setModalState: (state, action) => {
      const { open, type } = action.payload;

      state.modalOpen = open;
      state.type = type;
    },
  },
});

export const { setModalState } = modalSlice.actions;

export default modalSlice.reducer;
