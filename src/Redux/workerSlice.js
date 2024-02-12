import { createSlice } from "@reduxjs/toolkit";
const workerSlice = createSlice({
  name: "worker",
  initialState: {
   editEnabled: false,
   workerList:[],
   worker:{},
   basicInfo:{},
   workerInfo:{},
   projectInfo:{},
   inputErr: {},
   requiredErr: {},
   changesMade: false,
   showProjectDetails:false,
   showWorkerDetails:false,
   showBasic:false,

  },

  reducers: {
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },

    setWorkerList(state, action) {
      state.workerList = action.payload;
    },
    setWorker(state, action) {
      state.worker = action.payload;
    },
    setBasicInfo(state, action) {
      state.basicInfo = action.payload;
    },
    setWorkerInfo(state, action) {
      state.workerInfo = action.payload;
    },
    setProjectInfo(state, action) {
      state.projectInfo = action.payload;
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
    setShowProjectDetails(state, action) {
      state.showProjectDetails = action.payload;
    },
    setShowWorkerDetails(state, action) {
      state.showWorkerDetails = action.payload;
    },
    setShowBasic(state, action) {
      state.showBasic = action.payload;
    },
  },
});



export default workerSlice.reducer;
export const {
  
  setBasicInfo,
  setEditEnabled,
  setWorker,
  setWorkerInfo,
  setProjectInfo,
  setInputErr,
  setRequiredErr,
  setChangesMade,
  setShowProjectDetails,
  setshowWorkerDetails,
  setShowBasic

 } =
workerSlice.actions;



