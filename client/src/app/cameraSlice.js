import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false };

const cameraSlice = createSlice({
  name: "cameraState",
  initialState,
  reducers: {
    setCameraState: (state, action) => {
      const { open } = action.payload;

      state.open = open;
    },
  },
});

export const { setCameraState } = cameraSlice.actions;

export default cameraSlice.reducer;
