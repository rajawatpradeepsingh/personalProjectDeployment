import { createSlice } from "@reduxjs/toolkit";

const navMenuSlice = createSlice({
  name: "nav",
  initialState: {
    navMenuOpen: false,
  },
  reducers: {
    setNavMenuOpen(state, action) {
      state.navMenuOpen = action.payload;
    },
  },
});

export default navMenuSlice.reducer;
export const { setNavMenuOpen } = navMenuSlice.actions;
