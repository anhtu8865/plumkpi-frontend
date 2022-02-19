import { configureStore } from '@reduxjs/toolkit'
import sidebarSlice from './slices/sidebarSlice'
import alertSlice from './slices/alertSlice'
import kpiCategorySlice from './slices/kpiCategorySlice'
import kpiTemplateSlice from './slices/kpiTemplateSlice'
import userSlice from './slices/userSlice'
import departmentSlice from './slices/departmentSlice'

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
    notifications: alertSlice.reducer,
    kpiCategory: kpiCategorySlice.reducer,
    kpiTemplate: kpiTemplateSlice.reducer,
    user: userSlice.reducer,
    department: departmentSlice.reducer,
  },
})

export default store
