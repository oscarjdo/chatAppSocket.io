import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false };

const imageSelectorSlice = createSlice({
  name: "imageSelectorState",
  initialState,
  reducers: {
    setImageSelectorState: (state, action) => {
      const { open, place, file } = action.payload;

      if (file != undefined) {
        state.file = file;
      }

      if (place != undefined) {
        state.place = place;
      }

      state.open = open;
    },
  },
});

export const { setImageSelectorState } = imageSelectorSlice.actions;

export default imageSelectorSlice.reducer;
