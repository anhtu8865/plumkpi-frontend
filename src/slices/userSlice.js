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
    userReload: false,
    userLoading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.value
    },
    setUserReload: (state) => {
      state.userReload = !state.userReload
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload.value
    },
    setUserList: (state, action) => {
      state.userList = action.payload.value
    },
    resetUser: (state) => {
      state.user = {
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
      }
    },
  },
})

export const { setUser, setUserLoading, setUserReload, resetUser } = userSlice.actions
export default userSlice
