import { createSlice } from '@reduxjs/toolkit'

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboardList: [],
  },
  reducers: {
    setDashboardList: (state, action) => {
      state.dashboardList = action.payload.value
    },
  },
})

export const { setDashboardList } = dashboardSlice.actions
export default dashboardSlice
