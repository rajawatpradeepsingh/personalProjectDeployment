import { createSlice } from "@reduxjs/toolkit";
const IGuideSlice = createSlice({
  name: "iGuide",
  initialState: {
    showGuide: false,
    guides: [],
    guide: {},
    addGuideOpen: false,
    areas: [],
    subjects: [],
    clients: [],
    editEnabled: false,

  },
  reducers: {
    setShowGuide(state, action) {
      state.showGuide = action.payload;
    },
    setGuides(state, action) {
      state.guides = action.payload;
    },
    setGuide(state, action) {
      state.guide = action.payload;
    },
    setAddGuideOpen(state, action) {
      state.addGuideOpen = action.payload;
    },
    setAreas(state, action) {
      state.areas = action.payload;
    },
    setSubjects(state, action) {
      state.subjects = action.payload;
    },
    setClients(state, action) {
      state.clients = action.payload;
    },
    setEditEnabled(state, action) {
      state.editEnabled = action.payload;
    },
  },
});

export default IGuideSlice.reducer;
export const {
  setShowGuide,
  setGuides,
  setGuide,
  setAddGuideOpen,
  setAreas,
  setSubjects,
  setClients,
  setEditEnabled,

} = IGuideSlice.actions;
