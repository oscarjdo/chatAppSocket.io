import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  type: "",
  mssgs: {},
  idToDelete: false,
  cameraFiles: false,
};

const filePreviewSlice = createSlice({
  name: "videoAudioState",
  initialState,
  reducers: {
    setFileToPreview: (state, action) => {
      const { data, type } = action.payload;

      state.type = type;

      if (data) {
        state.data = data.map((item) => {
          return {
            file: item.file,
            url: item.url ? item.url : null,
            mimetype: item.mimetype ? item.mimetype : null,
          };
        });
      } else {
        state.data = [];
      }
    },
    deleteFileToPreview: (state, action) => {
      const { id, index, data } = action.payload;

      state.data = data.filter((item, ind) => index !== ind);

      state.idToDelete = id;
    },
    setTexts: (state, action) => {
      const { id, value, clear } = action.payload;

      if (clear) state.mssgs = {};
      else state.mssgs = { ...state.mssgs, [id]: value };
    },
    setCameraFiles: (state, action) => {
      const { data, type } = action.payload;

      if (type) state.type = type;

      state.cameraFiles = data;
    },
  },
});

export const {
  setFileToPreview,
  deleteFileToPreview,
  setTexts,
  setCameraFiles,
} = filePreviewSlice.actions;

export default filePreviewSlice.reducer;
