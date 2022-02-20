import { configureStore } from '@reduxjs/toolkit'
import sidebarSlice from './slices/sidebarSlice'
import alertSlice from './slices/alertSlice'
import kpiCategorySlice from './slices/kpiCategorySlice'
import userSlice from './slices/userSlice'
import viewSlice from './slices/viewSlice'
import planSlice from './slices/planSlice'
import departmentSlice from './slices/departmentSlice'

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
    notifications: alertSlice.reducer,
    kpiCategory: kpiCategorySlice.reducer,
    user: userSlice.reducer,
    view: viewSlice.reducer,
    plan: planSlice.reducer,
    department: departmentSlice.reducer,
  },
})

export default store
