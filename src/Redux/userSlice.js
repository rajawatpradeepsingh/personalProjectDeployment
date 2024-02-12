import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    showModal: false,
    selectedUser: {},
    userList: [],
    userDetails: {},
    editEnabled: false
  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setUserList(state, action) {
      state.userList = action.payload;
    },
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    }
  },
});

export default userSlice.reducer;
export const { setShowModal, setUserList, setSelectedUser, setUserDetails, setEditEnabled } =
  userSlice.actions;
