import { createSlice } from '@reduxjs/toolkit'

const kpiRegisSlice = createSlice({
  name: 'kpiRegis',
  initialState: {
    kpiRegisReload: false,
    kpiRegisLoading: false,
    kpiRegisList: [],
  },
  reducers: {
    setKpiRegisReload: (state) => {
      state.kpiRegisReload = !state.kpiRegisReload
    },
    setKpiRegisLoading: (state, action) => {
      state.kpiRegisLoading = action.payload.value
    },
    setKpiRegisList: (state, action) => {
      state.kpiRegisList = action.payload.value
    },
  },
})

export const { setKpiRegisReload, setKpiRegisLoading, setKpiRegisList } = kpiRegisSlice.actions
export default kpiRegisSlice
