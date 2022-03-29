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
    temPage: 1,
    temTotalPage: 1,
    selectedQuarter: 1,
    selectedMonth: 3,
    checkedQuarter: false,
    checkedMonth: false,
    performResult: {},
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
    setTemPage: (state, action) => {
      state.temPage = action.payload.value
    },
    setTemTotalPage: (state, action) => {
      state.temTotalPage = action.payload.value
    },
    setSelectedQuarter: (state, action) => {
      state.selectedQuarter = action.payload.value
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload.value
    },
    setPerformResult: (state, action) => {
      state.performResult = action.payload.value
    },
    setCheckedQuarter: (state, action) => {
      state.checkedQuarter = action.payload.value
    },
    setCheckedMonth: (state, action) => {
      state.checkedMonth = action.payload.value
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
  setTemPage,
  setTemTotalPage,
  setSelectedQuarter,
  setSelectedMonth,
  setPerformResult,
  setCheckedQuarter,
  setCheckedMonth,
} = planDetailSlice.actions
export default planDetailSlice
