import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    showModal: false,
    selectedProject: {},
    projectList: [],
    editEnabled: false,
projectDetails: {}, 
basicInfo: {},
requiredErr: {},
changesMade:false,
inputErr: false,
showProjectDetails: false,



  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setProjectList(state, action) {
      state.projectList = action.payload;
    },
    setSelectedProject(state, action) {
      state.selectedProject = action.payload;
    },
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },
    setProjectDetails(state, action) {
      state.projectDetails = action.payload;
    },
    setProject(state, action) {
        state.project = action.payload;
      },
    setBasicInfo(state, action) {
        state.basicInfo = action.payload;
      },
      setRequiredErr(state, action) {
        state.requiredErr = action.payload;
      },
      setChangesMade(state, action) {
        state.changesMade = action.payload;
      },
      setInputErr(state, action) {
        state.inputErr = action.payload;
      },
      setShowProjectDetails(state, action) {
        state.showProjectDetails = action.payload;
      },
  }
});

export default projectSlice.reducer;
export const { setShowModal, setProjectList,setInputErr,setRequiredErr, setChangesMade,setSelectedProject,setProject, setProjectDetails , setEditEnabled,setBasicInfo,setShowProjectDetails
} =
projectSlice.actions;



