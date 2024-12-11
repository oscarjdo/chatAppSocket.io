import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false, intersecting: false, img: "" };

const avatarMenuSlice = createSlice({
  name: "avatarMenuSlice",
  initialState,
  reducers: {
    setAvatarMenuState: (state, action) => {
      state.open = action.payload.open;
    },

    setIntersectedAvatar: (state, action) => {
      const { intersected, img } = action.payload;

      state.intersecting = intersected;
      state.img = img;
    },
  },
});

export const { setAvatarMenuState, setIntersectedAvatar } =
  avatarMenuSlice.actions;

export default avatarMenuSlice.reducer;
