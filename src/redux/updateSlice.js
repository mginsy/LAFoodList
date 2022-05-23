import { createSlice } from '@reduxjs/toolkit'

export const updateSlice = createSlice({
  name: 'restaurantName',
  initialState: {
    value: "26th Ave Tacos",
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { update } = updateSlice.actions

export default updateSlice.reducer