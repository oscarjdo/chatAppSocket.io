import { createSlice } from "@reduxjs/toolkit";

const initialState = { active: false };

const notiTabSlice = createSlice({
  name: "notiTabState",
  initialState,
  reducers: {
    setNotiTabState: (state, action) => {
      const data = action.payload;

      state.active = data.active;
    },
  },
});

export const { setNotiTabState } = notiTabSlice.actions;

export default notiTabSlice.reducer;
