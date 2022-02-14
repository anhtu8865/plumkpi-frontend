import { createSlice } from '@reduxjs/toolkit'

const kpiTemplateSlice = createSlice({
  name: 'kpiTemplate',
  initialState: {
    templateReload: false,
    templateLoading: false,
    templateList: [],
  },
  reducers: {
    setTemplateReload: (state) => {
      state.templateReload = !state.TemplateReload
    },
    setTemplateLoading: (state, action) => {
      state.templateLoading = action.payload.value
    },
    setTemplateList: (state, action) => {
      state.templateList = action.payload.value
    },
  },
})

export const { setTemplateReload, setTemplateLoading, setTemplateList } = kpiTemplateSlice.actions
export default kpiTemplateSlice
