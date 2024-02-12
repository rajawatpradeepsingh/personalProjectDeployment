import { createSlice } from "@reduxjs/toolkit";

const workOrderSlice = createSlice({
  name: "workOrder",
  initialState: {
    showModal: false,
    selectedWorkOrder: {},
    workOrderList: [],
    editEnabled: false,
workOrderDetails: {}, 
basicInfo: {},
requiredErr: {},
changesMade:false,
inputErr: false,
showWorkOrderDetails: false,



  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setWorkOrderList(state, action) {
      state.workOrderList = action.payload;
    },
    setSelectedWorkOrder(state, action) {
      state.selectedWorkOrder = action.payload;
    },
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },
    setWorkOrderDetails(state, action) {
      state.workOrderDetails = action.payload;
    },
    setWorkOrder(state, action) {
        state.workOrder = action.payload;
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
      setShowWorkOrderDetails(state, action) {
        state.showWorkOrderDetails = action.payload;
      },
  }
});

export default workOrderSlice.reducer;
export const { setShowModal, setWorkOrderDetails,setInputErr,setRequiredErr, setChangesMade, setSelectedWorkOrder,setWorkOrder, setProjectDetails , setEditEnabled,setBasicInfo,setShowWorkOrderDetails
} =
workOrderSlice.actions;




