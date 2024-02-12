import { createSlice } from "@reduxjs/toolkit";

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    showModal: false,
    selectedSupplier: {},
    supplierList: [],
    basicInfo: {},
    ChangesMade: [],
    supplierDetails: {},
    editEnabled: false,
    inputErr: false,
    requiredErr: {},
    showBasic: false,
    showSupplier: false,
    showComments: false,

  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setSuppliersList(state, action) {
      state.supplierList = action.payload;
    },
    setSelectedSupplier(state, action) {
      state.selectedSupplier = action.payload;
    },
    setBasicInfo(state, action) {
      state.basicInfo = action.payload;
    },
    setChangesMade(state, action) {
      state.ChangesMade = action.payload;
    },
    setSupplierDetails(state, action) {
      state.setSupplierDetails = action.payload;
    },
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },
    setInputErr(state, action) {
      state.inputErr = action.payload;
    },
    setRequiredErr(state, action) {
      state.requiredErr = action.payload;
    },
    setShowComments(state, action) {
      state.showComments = action.payload;
    },
    setShowBasic(state, action) {
      state.showBasic = action.payload;
    },
    setShowSupplier(state, action) {
      state.showSupplier = action.payload;
    },
  },
});

export default supplierSlice.reducer;
export const { setShowModal,
   setSuppliersList, 
   setSelectedSupplier,
   setBasicInfo, 
   setChangesMade, 
   setSupplierDetails,
   setEditEnabled,
   setInputErr,
   setRequiredErr,
   setShowSupplier,
   setShowBasic,
   setShowComments,
  } =
  supplierSlice.actions;
