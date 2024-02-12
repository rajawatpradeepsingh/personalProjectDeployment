import { createSlice } from "@reduxjs/toolkit";

const managerSlice = createSlice({
  name: "manager",
  initialState: {
    showModal: false,
    selectedManager: {},
    inputErr: false,
    editEnabled: false,
    requiredErr: {},
    managerDetails: {},
    basicInfo: {},
    managerList:[],
    changesMade:false,
    showBasic:false,
    showManagerComments: false,
  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setManagerList(state, action) {
      state.managerList = action.payload;
    },
    setShowBasic(state, action) {
      state.showBasic = action.payload;
    },
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },
    setSelectedManager(state, action) {
      state.selectedManager = action.payload;
    },
    setManager(state, action) {
      state.manager = action.payload;
    },
    setInputErr(state, action) {
      state.inputErr = action.payload;
    },
    setChangesMade(state, action) {
      state.changesMade = action.payload;
    },
    setBasicInfo(state, action) {
      state.basicInfo = action.payload;
    },
    setComments(state, action) {
      state.comments = action.payload;
    },
    setManagerDetails(state, action) {
      state.managerDetails = action.payload;
    },
    setNewComment(state, action) {
      state.newComment = action.payload;
    },
    setShowManagerComments(state, action) {
      state.showManagerComments = action.payload;
    },
    setRequiredErr(state, action) {
      state.requiredErr = action.payload;
    },
  },
});

export default managerSlice.reducer;
export const {
  setShowModal,
  setSelectedManager,
  setBasicInfo,
  setChangesMade,
  setManager,
  setInputErr,
  setRequiredErr,
  setEditEnabled,
  setManagerDetails,
  setShow,
  setShowBasic,
  setShowManagerComments} = managerSlice.actions;
