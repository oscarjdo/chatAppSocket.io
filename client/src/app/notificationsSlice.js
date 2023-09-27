import { createSlice } from "@reduxjs/toolkit";

const initialState = { amount: 0 };

const notifcationsSlice = createSlice({
  name: "notificationsState",
  initialState,
  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
  },
});

export const { setAmount } = notifcationsSlice.actions;

export default notifcationsSlice.reducer;
