import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const videoAudioSlice = createSlice({
  name: "videoAudioState",
  initialState,
  reducers: {
    setVideoAudio: (state, action) => {
      const data = action.payload;

      state.file = data.file ? data.file : false;
      state.url = data.url ? data.url : false;
      state.mimetype = data.mimetype ? data.mimetype : false;
    },
  },
});

export const { setVideoAudio } = videoAudioSlice.actions;

export default videoAudioSlice.reducer;
