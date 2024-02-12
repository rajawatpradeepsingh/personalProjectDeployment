import { createSlice } from "@reduxjs/toolkit";
const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    showInterview: false,
    interview: {},
    viewSchedule: false,
    viewFeedback: false,
    addInterviewOpen: false
  },
  reducers: {
    setShowInterview(state, action) {
      state.showInterview = action.payload;
    },
    setInterview(state, action) {
      state.interview = action.payload;
    },
    setViewSchedule(state, action) {
      state.viewSchedule = action.payload;
    },
    setViewFeedback(state, action) {
      state.viewFeedback = action.payload;
    },
    setAddInterviewOpen(state, action) {
      state.addInterviewOpen = action.payload;
    }
  },
});

export default interviewSlice.reducer;
export const { setShowInterview, setInterview, setViewFeedback, setViewSchedule, setAddInterviewOpen } = interviewSlice.actions;
