import { createSlice } from '@reduxjs/toolkit'

const planDetailSlice = createSlice({
  name: 'planDetail',
  initialState: {
    catInPlan: [],
    temInPlan: [],
    currentCat: { kpi_category: {} },
    currentInPlan: { catList: [], temList: [] },
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
    setCurrentInPlan: (state, action) => {
      state.currentInPlan = action.payload.value
    },
    changeWeightInCat: (state, action) => {
      const findCat = state.currentInPlan.catList.find(
        (item) => item.cat.kpi_category_id === action.payload.id,
      )
      if (findCat) {
        findCat.weight = action.payload.value
      }
    },
    changeWeightInTem: (state, action) => {
      const findTem = state.currentInPlan.temList.find(
        (item) => item.tem.kpi_template_id === action.payload.id,
      )
      if (findTem) {
        findTem.weight = action.payload.value
      }
    },
  },
})

export const {
  setCatInPlan,
  setTemInPlan,
  setCurrentCat,
  setCurrentInPlan,
  changeWeightInCat,
  changeWeightInTem,
} = planDetailSlice.actions
export default planDetailSlice
