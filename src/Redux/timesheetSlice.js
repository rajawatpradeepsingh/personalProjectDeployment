  import { createSlice } from "@reduxjs/toolkit";
  const timesheetSlice = createSlice({
    name: "timesheet",
    initialState: {
      timeSheetDetails: {},
      ChangesMade: [],
      inputErr: false,
      requiredErr: {},
      editEnabled: false,
      showModal: false,
      timeSheet:{},
    },
    reducers: {
      setShowModal(state, action) {
        state.showModal = action.payload;
      },
      setTimeSheetDetails(state, action) {
        state.timeSheetDetails = action.payload;
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
      setTimeSheet(state, action) {
        state.timeSheet = action.payload;
      },
    },
  });
  
  export default timesheetSlice.reducer;
  export const { 
    setTimeSheetDetails, 
       setChangesMade,
       setInputErr,
       setRequiredErr,
       setEditEnabled,
       setShowModal,
       setTimeSheet
   } =
  timesheetSlice.actions;
  
  