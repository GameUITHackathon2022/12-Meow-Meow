import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  language: "en",
  theme: 0,
  showSidebar: false,
  sidebar: true
};

export const configSlice = createSlice({
  name: 'clientConfig',
  initialState,
  reducers: {
    setLang: (state, action) => {
      state.language = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLang, setTheme, setShowSidebar } = configSlice.actions

export default configSlice.reducer