import { configureStore } from '@reduxjs/toolkit'
import pdfReducer from './slices/pdfSlice'
import imageReducer from './slices/imageSlice'

const store = configureStore({
  reducer: {
    pdf: pdfReducer,
    image: imageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['pdf/uploadFile', 'image/uploadFile'],
      },
    }),
})

export default store