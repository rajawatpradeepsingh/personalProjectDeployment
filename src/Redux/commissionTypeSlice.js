import { createSlice } from "@reduxjs/toolkit";

const commissionTypeSlice = createSlice({
  name: "commissionType",
  initialState: {
    commissionTypeDetails: {},
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
    setCommissionTypeDetails(state, action) {
      state.commissionTypeDetails = action.payload;
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

export default commissionTypeSlice.reducer;
export const { 
  setCommissionTypeDetails, 
  setChangesMade,
  setInputErr,
  setRequiredErr,
  setEditEnabled,
  setShowModal,
} =
commissionTypeSlice.actions;
