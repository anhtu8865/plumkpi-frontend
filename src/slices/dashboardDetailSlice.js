import { createSlice } from '@reduxjs/toolkit'

const dashboardDetailSlice = createSlice({
  name: 'dashboardDetail',
  initialState: {
    dashboard: {},
    selectedDashboard: null,
  },
  reducers: {
    setDashboard: (state, action) => {
      state.dashboard = action.payload.value
    },
    setSelectedDashboard: (state, action) => {
      state.selectedDashboard = action.payload.value
    },
  },
})

export const { setDashboard, setSelectedDashboard } = dashboardDetailSlice.actions
export default dashboardDetailSlice
