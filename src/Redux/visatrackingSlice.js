import { createSlice } from "@reduxjs/toolkit";
const visatrackingSlice = createSlice({
  name: "visatracking",
  initialState: {
    visaDetails: {},
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
    setVisaDeatils(state, action) {
      state.visaDetails = action.payload;
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

export default visatrackingSlice.reducer;
export const { 
  setVisaDeatils, 
     setChangesMade,
     setInputErr,
     setRequiredErr,
     setEditEnabled,
     setShowModal,
 } =
visatrackingSlice.actions;

