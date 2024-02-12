import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuth: false, requestResult: {} },
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setRequestResult: (state, action) => {
      state.requestResult = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setIsAuth, setRequestResult, setToken } = authSlice.actions;
export default authSlice.reducer;
