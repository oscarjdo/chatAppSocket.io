import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  type: null,
};

const editGroupDataSlice = createSlice({
  name: "editGroupDataState",
  initialState,
  reducers: {
    setEditGroupDataState: (state, action) => {
      const { open, type } = action.payload;
      state.open = open;
      state.type = type;
    },
  },
});

export const { setEditGroupDataState } = editGroupDataSlice.actions;

export default editGroupDataSlice.reducer;
