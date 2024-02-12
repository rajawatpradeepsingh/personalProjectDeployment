import { createSlice } from "@reduxjs/toolkit";

const onBoardingSlice = createSlice({
  name: "onBoarding",
  initialState: {
    basicInfo: {},
    ChangesMade: [],
    inputErr: false,
    requiredErr: {},
    editEnabled: false,
    onBoardingDetails:{},
    showModal: false,
    projectInfo:{},



  },
  reducers: {
    setBasicInfo(state, action) {
        state.basicInfo = action.payload;
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
      setOnbordingDetails(state, action) {
        state.onBoardingDetails = action.payload;
      },
      setShowModal(state, action) {
        state.showModal = action.payload;
      },
      setProjectInfo(state, action) {
        state.projectInfo = action.payload;
      },
  },
});

export default onBoardingSlice.reducer;
export const {  
     setBasicInfo, 
     setChangesMade,
     setInputErr,
     setRequiredErr,
     setEditEnabled,
     setOnbordingDetails,
     setShowModal,
     setProjectInfo,


} = onBoardingSlice.actions;
