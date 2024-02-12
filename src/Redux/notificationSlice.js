import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    tab: "",
    page: 1,
    pageSize: 10,
    selectedNotification: {},
    showNotification: false,
  },
  reducers: {
    setTab(state, action) {
      state.tab = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    setShowNotification(state, action) {
      state.showNotification = action.payload;
    },
    setSelectedNotification(state, action) {
      state.selectedNotification = action.payload;
    },
  },
});

export default notificationSlice.reducer;
export const {
  setTab,
  setPage,
  setPageSize,
  setShowNotification,
  setSelectedNotification,
} = notificationSlice.actions;
