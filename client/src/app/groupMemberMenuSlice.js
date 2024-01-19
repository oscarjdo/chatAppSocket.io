import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false, userData: { username: "" } };

const groupMemberMenuSlice = createSlice({
  name: "groupMemberMenuState",
  initialState,
  reducers: {
    setMember: (state, { payload }) => {
      const { open, userData } = payload;
      state.open = open;
      state.userData = userData;
    },
  },
});

export const { setMember } = groupMemberMenuSlice.actions;

export default groupMemberMenuSlice.reducer;
