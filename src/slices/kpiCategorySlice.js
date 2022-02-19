import { createSlice } from '@reduxjs/toolkit'

const kpiCategorySlice = createSlice({
  name: 'kpiCategory',
  initialState: {
    categoryList: [],
  },
  reducers: {
    setCategoryList: (state, action) => {
      state.categoryList = action.payload.value
    },
  },
})

export const { setCategoryList } = kpiCategorySlice.actions
export default kpiCategorySlice
