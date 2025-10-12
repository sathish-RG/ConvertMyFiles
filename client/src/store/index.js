import { configureStore } from '@reduxjs/toolkit'
import pdfReducer from './slices/pdfSlice'
import imageReducer from './slices/imageSlice'
import batchImageReducer from './slices/batchImageSlice'
import batchConvertReducer from './slices/batchConvertSlice'

const store = configureStore({
  reducer: {
    pdf: pdfReducer,
    image: imageReducer,
    batchImage: batchImageReducer,
    batchConvert: batchConvertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'pdf/uploadFile', 
          'image/uploadFile',
          'batchImage/addFiles',
          'batchImage/compressIndividual/pending',
          'batchImage/compressIndividual/fulfilled',
          'batchImage/compressIndividual/rejected',
          'batchImage/compressBatchImages/pending',
          'batchImage/compressBatchImages/fulfilled',
          'batchImage/compressBatchImages/rejected',
          'batchConvert/addFiles',
          'batchConvert/convertBatchImages/pending',
          'batchConvert/convertBatchImages/fulfilled',
          'batchConvert/convertBatchImages/rejected'
        ],
        ignoredActionsPaths: ['payload.file', 'payload.files', 'meta.arg.file', 'meta.arg.files'],
        ignoredPaths: ['batchImage.files', 'batchImage.individualResults', 'batchConvert.files'],
      },
    }),
})

export default store