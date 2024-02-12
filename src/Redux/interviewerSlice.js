import { createSlice } from "@reduxjs/toolkit";
const interviewerSlice = createSlice({
  name: "interviewer",
  initialState: {
    showModal: false,
    selectedInterviewer: {},
  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setSelectedInterviewer(state, action) {
      state.selectedInterviewer = action.payload;
    },
  },
});

export default interviewerSlice.reducer;
export const { setShowModal, setSelectedInterviewer } =
  interviewerSlice.actions;
