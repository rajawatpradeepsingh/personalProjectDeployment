import { createSlice } from "@reduxjs/toolkit";

const candidateSlice = createSlice({
  name: "candidate",
  initialState: {
    editEnabled: false,
    addComment: false,
    show: false,
    candidatesList: [],
    candidate: {},
    basicInfo: {},
    professionalInfo: {},
    resume: {},
    commentsInfo: [],
    comments: [],
    newComment: null,
    resumeData: {},
    showBasic: false,
    showActivity: false,
    showComments: false,
    showSchedule: false,
    inputErr: {},
    requiredErr: {},
    changesMade: false,
    newJobActivity: {},
  },
  reducers: {
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },
    setAddComment(state, action) {
      state.addComment = action.payload;
    },
    setShow(state, action) {
      state.show = action.payload;
    },
    setCandidatesList(state, action) {
      state.candidatesList = action.payload;
    },
    setCandidate(state, action) {
      state.candidate = action.payload;
    },
    setBasicInfo(state, action) {
      state.basicInfo = action.payload;
    },
    setProfessionalInfo(state, action) {
      state.professionalInfo = action.payload;
    },
    setResume(state, action) {
      state.resume = action.payload;
    },
    setCommentsInfo(state, action) {
      state.commentsInfo = action.payload;
    },
    setComments(state, action) {
      state.comments = action.payload;
    },
    setNewComment(state, action) {
      state.newComment = action.payload;
    },
    setResumeData(state, action) {
      state.resumeData = action.payload;
    },
    setShowComments(state, action) {
      state.showComments = action.payload;
    },
    setShowBasic(state, action) {
      state.showBasic = action.payload;
    },
    setShowActivity(state, action) {
      state.showActivity = action.payload;
    },
    setInputErr(state, action) {
      state.inputErr = action.payload;
    },
    setRequiredErr(state, action) {
      state.requiredErr = action.payload;
    },
    setChangesMade(state, action) {
      state.changesMade = action.payload;
    },
    setNewJobActivity(state, action) {
      state.newJobActivity = action.payload;
    },
  },
});

export default candidateSlice.reducer;
export const {
  setEditEnabled,
  setAddComment,
  setShow,
  setCandidatesList,
  setCandidate,
  setBasicInfo,
  setProfessionalInfo,
  setResume,
  setCommentsInfo,
  setComments,
  setNewComment,
  setResumeData,
  setShowActivity,
  setShowBasic,
  setShowComments,
  setInputErr,
  setRequiredErr,
  setChangesMade,
  setNewJobActivity,
} = candidateSlice.actions;
