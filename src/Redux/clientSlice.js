import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
  name: "client",
  initialState: {
    showModal: false,
    selectedClient: {},
    clientsList: [],
    ChangesMade: [],
    inputErr: false,
    editEnabled: false,
    requiredErr: {},
    basicInfo: {},
    showComments: false,
    commentsInfo: [],
    comments: [],
    addComment: false,
    newComment: {},
    clientInfo: {},
    newClientTax: {},
    clientTaxes: [],
    clientTaxesFormData: {},
  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setAddComment(state, action) {
      state.addComment = action.payload;
    },
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },
    setClientsList(state, action) {
      state.clientsList = action.payload;
    },
    setSelectedClient(state, action) {
      state.selectedClient = action.payload;
    },
    setChangesMade(state, action) {
      state.ChangesMade = action.payload;
    },
    setClient(state, action) {
      state.client = action.payload;
    },
    setInputErr(state, action) {
      state.inputErr = action.payload;
    },
    setBasicInfo(state, action) {
      state.basicInfo = action.payload;
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
    setShowComments(state, action) {
      state.showComments = action.payload;
    },
    setClietInfo(state, action) {
      state.clientInfo = action.payload;
    },
    setNewClientTax(state, action) {
      state.newClientTax = action.payload;
    },
    setClientTaxes(state, action) {
      state.clientTaxes = action.payload;
    },
    setClientTaxesFormData(state, action) {
      state.clientTaxesFormData = action.payload;
    },
    setRequiredErr(state, action) {
      state.requiredErr = action.payload;
    },
  },
});

export default clientSlice.reducer;
export const {
  setShowModal,
  setClientsList,
  setSelectedClient,
  setBasicInfo,
  setChangesMade,
  setClient,
  setInputErr,
  setRequiredErr,
  setEditEnabled,
  setAddComment,
  setShow,
  setCommentsInfo,
  setComments,
  setNewComment,
  setShowComments,
  setClientInfo,
  setNewClientTax,
  setClientTaxes,
  setClientTaxesFormData,
} = clientSlice.actions;
