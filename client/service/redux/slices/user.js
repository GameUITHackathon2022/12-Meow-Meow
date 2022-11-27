import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  info: [],
};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      (state.loggedIn = true), (state.info = action.payload);
    },
    setLogOut: (state, action) => {
      (state.loggedIn = false), (state.info = []);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoggedIn, setLogOut } = userSlice.actions;

export default userSlice.reducer;
