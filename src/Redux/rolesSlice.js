import { createSlice } from "@reduxjs/toolkit";

const rolesSlice = createSlice({
   name: "roles",
   initialState: {
      roles: [],
      selectedRole: {}
   },
   reducers: {
      setRoles(state, action) {
         state.roles = action.payload;
      },
      setSelectedRole(state, action) {
         state.selectedRole = action.payload;
      }
   }
});

export default rolesSlice.reducer;
export const { setRoles, setSelectedRole } = rolesSlice.actions;