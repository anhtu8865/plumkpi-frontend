import { createSlice } from '@reduxjs/toolkit'

const planDetailSlice = createSlice({
  name: 'planDetail',
  initialState: {
    catInPlan: [],
    temInPlan: [],
    currentCat: { kpi_category: {} },
  },
  reducers: {
    setCatInPlan: (state, action) => {
      state.catInPlan = action.payload.value
    },
    setTemInPlan: (state, action) => {
      state.temInPlan = action.payload.value
    },
    setCurrentCat: (state, action) => {
      state.currentCat = action.payload.value
    },
  },
})

export const { setCatInPlan, setTemInPlan, setCurrentCat } = planDetailSlice.actions
export default planDetailSlice
