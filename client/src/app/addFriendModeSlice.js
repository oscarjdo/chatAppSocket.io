import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transition: false,
  open: false,
};

const addFriendModeSlice = createSlice({
  name: "addFriendMOdeSlice",
  initialState,
  reducers: {
    setAddFriendMode: (state, action) => {
      const mode = action.payload;
      for (const it in mode) {
        state[it] = mode[it];
      }
    },
  },
});

export const { setAddFriendMode } = addFriendModeSlice.actions;

export default addFriendModeSlice.reducer;
