import { createSlice } from "@reduxjs/toolkit";

const shareDataSlice = createSlice({
  name: "shareData",
  initialState: {
    showModal: false,
  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
  },
});

export default shareDataSlice.reducer;
export const { setShowModal } = shareDataSlice.actions;
