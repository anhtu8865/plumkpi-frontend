import { createSlice } from '@reduxjs/toolkit'

const viewSlice = createSlice({
  name: 'plan',
  initialState: {
    reload: false,
    loading: true,
  },
  reducers: {
    setReload: (state) => {
      state.reload = !state.reload
    },
    setLoading: (state, action) => {
      state.loading = action.payload.value
    },
  },
})

export const { setReload, setLoading } = viewSlice.actions
export default viewSlice
