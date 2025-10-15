import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunks for PDF operations
export const compressPDF = createAsyncThunk(
  'pdf/compress',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('pdf', file)
      
      const response = await api.post('/pdf/compress', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      })
      
      return {
        blob: response.data,
        filename: `compressed-${file.name}`
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to compress PDF')
    }
  }
)

export const compressAdvancedPDF = createAsyncThunk(
  'pdf/compressAdvanced',
  async ({ file, options }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('pdf', file)

      // Append compression options
      Object.keys(options).forEach(key => {
        formData.append(key, options[key])
      })

      const response = await api.post('/pdf/compress-advanced', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      })

      return {
        blob: response.data,
        filename: `compressed-${file.name}`
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to compress PDF')
    }
  }
)

export const splitPDF = createAsyncThunk(
  'pdf/split',
  async ({ file, startPage, endPage }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('startPage', startPage)
      formData.append('endPage', endPage)
      
      const response = await api.post('/pdf/split', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      })
      
      return {
        blob: response.data,
        filename: `split-${file.name}`
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to split PDF')
    }
  }
)

export const rotatePDF = createAsyncThunk(
  'pdf/rotate',
  async ({ file, rotation }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('rotation', rotation)
      
      const response = await api.post('/pdf/rotate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      })
      
      return {
        blob: response.data,
        filename: `rotated-${file.name}`
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to rotate PDF')
    }
  }
)

export const convertPDFToWord = createAsyncThunk(
  'pdf/convertToWord',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('pdf', file)
      
      const response = await api.post('/pdf/pdf-to-word', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      })
      
      return {
        blob: response.data,
        filename: `${file.name.replace('.pdf', '.docx')}`
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to convert PDF to Word')
    }
  }
)

const initialState = {
  loading: false,
  error: null,
  success: false,
  downloadUrl: null,
  filename: null
}

const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
      state.downloadUrl = null
      state.filename = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Compress PDF
    builder
      .addCase(compressPDF.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(compressPDF.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.downloadUrl = URL.createObjectURL(action.payload.blob)
        state.filename = action.payload.filename
      })
      .addCase(compressPDF.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    
    // Advanced Compress PDF
    builder
      .addCase(compressAdvancedPDF.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(compressAdvancedPDF.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.downloadUrl = URL.createObjectURL(action.payload.blob)
        state.filename = action.payload.filename
      })
      .addCase(compressAdvancedPDF.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    
    // Split PDF
    builder
      .addCase(splitPDF.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(splitPDF.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.downloadUrl = URL.createObjectURL(action.payload.blob)
        state.filename = action.payload.filename
      })
      .addCase(splitPDF.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    
    // Rotate PDF
    builder
      .addCase(rotatePDF.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(rotatePDF.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.downloadUrl = URL.createObjectURL(action.payload.blob)
        state.filename = action.payload.filename
      })
      .addCase(rotatePDF.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    
    // Convert PDF to Word
    builder
      .addCase(convertPDFToWord.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(convertPDFToWord.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.downloadUrl = URL.createObjectURL(action.payload.blob)
        state.filename = action.payload.filename
      })
      .addCase(convertPDFToWord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { resetState, clearError } = pdfSlice.actions
export default pdfSlice.reducer