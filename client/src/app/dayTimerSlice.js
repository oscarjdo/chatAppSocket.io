import { createSlice } from "@reduxjs/toolkit";

const initialState = { day: null };

const dayTimerSlice = createSlice({
  name: "dayTimerState",
  initialState,
  reducers: {
    changeDay: (state, action) => {
      const { day } = action.payload;

      state.day = day;
    },
  },
});

export const { changeDay } = dayTimerSlice.actions;

export default dayTimerSlice.reducer;
