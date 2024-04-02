import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false, userData: { username: "" } };

const groupMemberMenuSlice = createSlice({
  name: "groupMemberMenuState",
  initialState,
  reducers: {
    setMember: (state, { payload }) => {
      const { open, userData, isAdmin } = payload;
      state.open = open;
      state.userData = userData;
      state.isAdmin = isAdmin;
    },
  },
});

export const { setMember } = groupMemberMenuSlice.actions;

export default groupMemberMenuSlice.reducer;
