import { createSlice } from '@reduxjs/toolkit'

const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    alerts: [],
  },
  reducers: {
    createAlert: (state, action) => {
      state.alerts.push({
        message: action.payload.message,
        type: action.payload.type,
      })
    },
    clearAlert: (state) => {
      state.alerts = []
    },
  },
})

export const { createAlert, clearAlert } = alertSlice.actions
export default alertSlice
