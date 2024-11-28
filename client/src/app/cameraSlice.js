import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false };

const cameraSlice = createSlice({
  name: "cameraState",
  initialState,
  reducers: {
    setCameraState: (state, action) => {
      const { open, to } = action.payload;

      state.open = open;
      state.to = to;
    },
  },
});

export const { setCameraState } = cameraSlice.actions;

export default cameraSlice.reducer;
