import { createSlice } from '@reduxjs/toolkit'

const departmentSlice = createSlice({
  name: 'department',
  initialState: {
    departmentReload: false,
    departmentLoading: false,
    departmentList: [],
  },
  reducers: {
    setDepartmentReload: (state) => {
      state.departmentReload = !state.departmentReload
    },
    setDepartmentLoading: (state, action) => {
      state.departmentLoading = action.payload.value
    },
    setDepartmentList: (state, action) => {
      state.departmentList = action.payload.value
    },
  },
})

export const { setDepartmentReload, setDepartmentLoading, setDepartmentList } =
  departmentSlice.actions
export default departmentSlice
