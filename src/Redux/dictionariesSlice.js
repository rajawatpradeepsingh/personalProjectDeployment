import { createSlice } from "@reduxjs/toolkit";

const dictionariesSlice = createSlice({
   name: "dictionaries",
   initialState: {
      candidateRoles: [],
      primarySkills: []
   },
   reducers: {
      setCandidateRoles(state, action) {
         state.candidateRoles = action.payload;
      },
      setPrimarySkills(state, action) {
         state.primarySkills = action.payload;
      }
   }
});

export default dictionariesSlice.reducer;
export const {
   setCandidateRoles,
   setPrimarySkills
} = dictionariesSlice.actions;