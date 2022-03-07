import { configureStore } from '@reduxjs/toolkit'
import sidebarSlice from './slices/sidebarSlice'
import alertSlice from './slices/alertSlice'
import kpiCategorySlice from './slices/kpiCategorySlice'
import userSlice from './slices/userSlice'
import viewSlice from './slices/viewSlice'
import planSlice from './slices/planSlice'
import departmentSlice from './slices/departmentSlice'
import planDetailSlice from './slices/planDetailSlice'
import kpiRegisSlice from './slices/kpiRegisSlice'
import kpiApprovingSlice from './slices/kpiApprovingSlice'

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
    notifications: alertSlice.reducer,
    kpiCategory: kpiCategorySlice.reducer,
    user: userSlice.reducer,
    view: viewSlice.reducer,
    plan: planSlice.reducer,
    planDetail: planDetailSlice.reducer,
    department: departmentSlice.reducer,
    kpiRegis: kpiRegisSlice.reducer,
    kpiApproving: kpiApprovingSlice.reducer,
  },
})

export default store
