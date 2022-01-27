import { createStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

/*const initialState = {
  sidebarShow: true,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}*/

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    sidebarShow: true,
    unfoldable: false,
  },
  reducers: {
    setSidebarShow: (state) => {
      state.sidebarShow = !state.sidebarShow
    },
    setUnfoldable: (state) => {
      state.unfoldable = !state.unfoldable
    },
  },
})

const AlertSlice = createSlice({
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

const store = configureStore({
  reducer: { sidebar: sidebarSlice.reducer, notifications: AlertSlice.reducer },
})
//createStore(changeState)
export const { setSidebarShow, setUnfoldable } = sidebarSlice.actions
export const { createAlert, clearAlert } = AlertSlice.actions
export default store
