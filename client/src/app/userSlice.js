import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    getUserToken: (state, action) => {
      const data = action.payload;

      if (data) {
        for (const it in data) {
          state[it] = data[it];
        }
      } else {
        for (const it in state) {
          state[it] = false;
        }
      }
    },
  },
});

export const { getUserToken } = userSlice.actions;

export default userSlice.reducer;
