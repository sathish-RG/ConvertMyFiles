import { configureStore } from '@reduxjs/toolkit'
import pdfReducer from './slices/pdfSlice'
import imageReducer from './slices/imageSlice'
import batchImageReducer from './slices/batchImageSlice'
import batchPDFReducer from './slices/batchPDFSlice'
import batchConvertReducer from './slices/batchConvertSlice'
import wordToPDFReducer from './slices/wordToPDFSlice'

const store = configureStore({
  reducer: {
    pdf: pdfReducer,
    image: imageReducer,
    batchImage: batchImageReducer,
    batchPDF: batchPDFReducer,
    batchConvert: batchConvertReducer,
    wordToPDF: wordToPDFReducer,
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
          'batchPDF/addFiles',
          'batchPDF/compressIndividual/pending',
          'batchPDF/compressIndividual/fulfilled',
          'batchPDF/compressIndividual/rejected',
          'batchPDF/compressBatchPDFs/pending',
          'batchPDF/compressBatchPDFs/fulfilled',
          'batchPDF/compressBatchPDFs/rejected',
          'batchConvert/addFiles',
          'batchConvert/convertBatchImages/pending',
          'batchConvert/convertBatchImages/fulfilled',
          'batchConvert/convertBatchImages/rejected',
          'wordToPDF/convert/pending',
          'wordToPDF/convert/fulfilled',
          'wordToPDF/convert/rejected'
        ],
        ignoredActionsPaths: ['payload.file', 'payload.files', 'meta.arg.file', 'meta.arg.files'],
        ignoredPaths: ['batchImage.files', 'batchImage.individualResults', 'batchPDF.files', 'batchPDF.individualResults', 'batchConvert.files'],
      },
    }),
})

export default store