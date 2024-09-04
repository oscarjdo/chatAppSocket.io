import { createSlice } from "@reduxjs/toolkit";

const initialState = { loged: false };

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
    setUserLoged: (state, action) => {
      state.loged = true;
    },
  },
});

export const { getUserToken, setUserLoged } = userSlice.actions;

export default userSlice.reducer;
