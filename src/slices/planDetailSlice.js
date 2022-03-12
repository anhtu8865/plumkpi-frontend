import { createSlice } from '@reduxjs/toolkit'

const planDetailSlice = createSlice({
  name: 'planDetail',
  initialState: {
    plan: { plan_name: '' },
    catInPlan: [],
    temInPlan: [],
    currentCat: { kpi_category: {} },
    currentInPlan: { catList: [], temList: [] },
    newInPlan: { catList: [], temList: [] },
  },
  reducers: {
    setPlan: (state, action) => {
      state.plan = action.payload.value
    },
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
      if (action.payload.value.catList) {
        state.currentInPlan.catList = action.payload.value.catList
      }
      if (action.payload.value.temList) {
        state.currentInPlan.temList = action.payload.value.temList
      }
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
    setNewInPlan: (state, action) => {
      state.newInPlan = action.payload.value
    },
  },
})

export const {
  setPlan,
  setCatInPlan,
  setTemInPlan,
  setCurrentCat,
  setCurrentInPlan,
  changeWeightInCat,
  changeWeightInTem,
  setNewInPlan,
} = planDetailSlice.actions
export default planDetailSlice
