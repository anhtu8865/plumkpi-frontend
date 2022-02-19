import { createSlice } from '@reduxjs/toolkit'

const planSlice = createSlice({
  name: 'plan',
  initialState: {
    planList: [],
  },
  reducers: {
    setPlanList: (state, action) => {
      state.planList = action.payload.value
    },
  },
})

export const { setPlanList } = planSlice.actions
export default planSlice
