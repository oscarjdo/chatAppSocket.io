import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  active: false,
  text: "",
  type: "",
  waitText: null,
  waitType: null,
};

const notiSlice = createSlice({
  name: "notiState",
  initialState,
  reducers: {
    setNotiState: (state, action) => {
      const { active, text, type, changed, close } = action.payload;

      state.waitText = null;
      state.waitType = null;

      if (close) {
        state.active = false;
      } else if (changed) {
        state.active = true;
        state.text = text;
        state.type = type;
      } else if (state.active && !state.waitText) {
        state.active = false;
        state.waitText = text;
        state.waitType = type;
      } else {
        state.active = active;
        state.text = text;
        state.type = type;
      }
    },
  },
});

export const { setNotiState } = notiSlice.actions;

export default notiSlice.reducer;
