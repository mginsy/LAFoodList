import { configureStore } from '@reduxjs/toolkit'
import updateReducer from './updateSlice'

export default configureStore({
  reducer: {
    updater: updateReducer
  },
})