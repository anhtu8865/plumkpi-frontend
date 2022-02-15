import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      user_id: null,
      user_name: null,
      email: null,
      role: null,
      phone: null,
      gender: 'None',
      address: null,
      dob: null,
      dept: null,
      avatar: null,
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.value
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice
