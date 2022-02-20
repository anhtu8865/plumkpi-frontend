import { configureStore } from '@reduxjs/toolkit'
import sidebarSlice from './slices/sidebarSlice'
import alertSlice from './slices/alertSlice'
import kpiCategorySlice from './slices/kpiCategorySlice'
import userSlice from './slices/userSlice'
import viewSlice from './slices/viewSlice'
import planSlice from './slices/planSlice'
import planDetailSlice from './slices/planDetailSlice'

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
    notifications: alertSlice.reducer,
    kpiCategory: kpiCategorySlice.reducer,
    user: userSlice.reducer,
    view: viewSlice.reducer,
    plan: planSlice.reducer,
    planDetail: planDetailSlice.reducer,
  },
})

export default store
