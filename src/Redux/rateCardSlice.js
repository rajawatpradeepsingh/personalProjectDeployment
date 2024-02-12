import { createSlice } from "@reduxjs/toolkit";

const rateCardSlice = createSlice({
  name: "ratecard",
  initialState: {
    rateCardDetails: {},
    ChangesMade: [],
    inputErr: false,
    requiredErr: {},
    editEnabled: false,
    showModal: false,
  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setRateCardDetails(state, action) {
      state.rateCardDetails = action.payload;
    },
    setChangesMade(state, action) {
      state.ChangesMade = action.payload;
    },
    setInputErr(state, action) {
      state.inputErr = action.payload;
    },
    setRequiredErr(state, action) {
      state.requiredErr = action.payload;
    },
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },
  },
});

export default rateCardSlice.reducer;
export const { 
  setRateCardDetails, 
  setChangesMade,
  setInputErr,
  setRequiredErr,
  setEditEnabled,
  setShowModal,
} =
rateCardSlice.actions;
