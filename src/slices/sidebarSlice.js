import { createSlice } from '@reduxjs/toolkit'

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    sidebarShow: true,
    unfoldable: false,
  },
  reducers: {
    setSidebarShow: (state) => {
      state.sidebarShow = !state.sidebarShow
    },
    setUnfoldable: (state) => {
      state.unfoldable = !state.unfoldable
    },
  },
})

export const { setSidebarShow, setUnfoldable } = sidebarSlice.actions
export default sidebarSlice
