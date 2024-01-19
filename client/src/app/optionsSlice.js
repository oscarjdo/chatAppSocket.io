import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false, type: null };

const optionsSlice = createSlice({
  name: "userInfoState",
  initialState,
  reducers: {
    setOptionsState: (state, action) => {
      const { open, type } = action.payload;

      state.open = open;
      state.type = type;
    },
  },
});

export const {
  reducer: optionsReducer,
  actions: { setOptionsState },
} = optionsSlice;
