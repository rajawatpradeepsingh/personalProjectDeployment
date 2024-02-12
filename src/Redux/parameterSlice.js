import { createSlice } from "@reduxjs/toolkit";

const parameterSlice = createSlice({
  name: "parameter",
  initialState: {
    showModal: false,
    selectedParameter: {},
    parameterList: [],
    editEnabled: false,
parameterDetails: {}, 

  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setParametersList(state, action) {
      state.parameterList = action.payload;
    },
    setSelectedParameter(state, action) {
      state.selectedParameter = action.payload;
    },
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },
    setParameterDetails(state, action) {
      state.parameterDetails = action.payload;
    }
  },
});

export default parameterSlice.reducer;
export const { setShowModal, setParametersList, setSelectedParameter, setParameterDetails , setEditEnabled,
} =
  parameterSlice.actions;
