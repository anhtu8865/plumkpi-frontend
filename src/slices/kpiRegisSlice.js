import { createSlice } from '@reduxjs/toolkit'

const kpiRegisSlice = createSlice({
  name: 'kpiRegis',
  initialState: {
    kpiRegisList: [],
  },
  reducers: {
    setKpiRegisList: (state, action) => {
      state.kpiRegisList = action.payload.value
    },
  },
})

export const { setKpiRegisList } = kpiRegisSlice.actions
export default kpiRegisSlice
