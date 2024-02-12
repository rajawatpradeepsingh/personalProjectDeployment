import { createSlice } from "@reduxjs/toolkit";

const noteSlice = createSlice({
  name: "notes",
  initialState: {
    showModal: false,
    selectedNote: {},
    noteList: [],
  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setNoteList(state, action) {
      state.noteList = action.payload;
    },
    setSelectedNote(state, action) {
      state.selectedNote = action.payload;
    },
  },
});

export default noteSlice.reducer;
export const { setShowModal, setNoteList, setSelectedNote } =
  noteSlice.actions;
