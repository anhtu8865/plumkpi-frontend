import { createSlice } from '@reduxjs/toolkit'

const timeSlice = createSlice({
  name: 'today',
  initialState: {
    today: { time: '2000-01-01' },
  },
  reducers: {
    setTime: (state, action) => {
      state.today = action.payload.value
    },
  },
})

export const { setTime } = timeSlice.actions
export default timeSlice
