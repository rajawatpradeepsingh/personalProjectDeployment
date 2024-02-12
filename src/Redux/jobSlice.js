import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobsList: [],
    showJob: false,
    job: {},
    ChangesMade: [],
    inputErr: false,
    requiredErr: {},
    editEnabled: false,
    jobDetails: {},
    showModal: false,
    projectInfo: {},
  },
  reducers: {
    setJobsList(state, action) {
      state.jobsList = action.payload;
    },
    setShowJob(state, action) {
      state.showJob = action.payload;
    },
    setJob(state, action) {
      state.job = action.payload;
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
    setJobDetails(state, action) {
      state.jobDetails = action.payload;
    },
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setProjectInfo(state, action) {
      state.projectInfo = action.payload;
    },
  },
});

export default jobSlice.reducer;
export const {
  setJobsList,
  setShowJob,
  setJob,
  setChangesMade,
  setInputErr,
  setRequiredErr,
  setEditEnabled,
  setJobDetails,
  setShowModal,
  setProjectInfo,
} = jobSlice.actions;
