import { createSlice } from '@reduxjs/toolkit'

const planDetailSlice = createSlice({
  name: 'planDetail',
  initialState: {
    catInPlan: [],
    temInPlan: [],
  },
  reducers: {
    setCatInPlan: (state, action) => {
      state.catInPlan = action.payload.value
    },
    setTemInPlan: (state, action) => {
      state.temInPlan = action.payload.value
    },
  },
})

export const { setCatInPlan, setTemInPlan } = planDetailSlice.actions
export default planDetailSlice
