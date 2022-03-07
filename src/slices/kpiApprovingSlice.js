import { createSlice } from '@reduxjs/toolkit'

const kpiApprovingSlice = createSlice({
  name: 'kpiApproving',
  initialState: {
    kpiApprovingReload: false,
    kpiApprovingLoading: false,
    kpiApprovingList: [],
  },
  reducers: {
    setKpiApprovingReload: (state) => {
      state.kpiApprovingReload = !state.kpiApprovingReload
    },
    setKpiApprovingLoading: (state, action) => {
      state.kpiApprovingLoading = action.payload.value
    },
    setKpiApprovingList: (state, action) => {
      state.kpiApprovingList = action.payload.value
    },
  },
})

export const { setKpiApprovingReload, setKpiApprovingLoading, setKpiApprovingList } =
  kpiApprovingSlice.actions
export default kpiApprovingSlice
