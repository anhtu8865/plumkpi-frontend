import { createSlice } from '@reduxjs/toolkit'

const kpiCategorySlice = createSlice({
  name: 'kpiCategory',
  initialState: {
    categoryReload: false,
    categoryLoading: false,
    categoryList: [],
  },
  reducers: {
    setCategoryReload: (state) => {
      state.categoryReload = !state.categoryReload
    },
    setCategoryLoading: (state, action) => {
      state.categoryLoading = action.payload.value
    },
    setCategoryList: (state, action) => {
      state.categoryList = action.payload.value
    },
  },
})

export const { setCategoryReload, setCategoryLoading, setCategoryList } = kpiCategorySlice.actions
export default kpiCategorySlice
