import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    countriesList: [],
    statesList: [],
    citiesList: [],
  },
  reducers: {
    setCountriesList(state, action) {
      state.countriesList = action.payload;
    },
    setStatesList(state, action) {
      state.statesList = action.payload;
    },
    setCitiesList(state, action) {
      state.citiesList = action.payload;
    },
  },
});

export default addressSlice.reducer;
export const { setCountriesList, setStatesList, setCitiesList } =
  addressSlice.actions;
