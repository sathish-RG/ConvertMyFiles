import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunks for image operations
export const convertImage = createAsyncThunk(
  'image/convert',
  async ({ file, format }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('format', format)
      
      const response = await api.post('/image/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      })
      
      const filename = `${file.name.split('.')[0]}.${format}`
      
      return {
        blob: response.data,
        filename
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to convert image')
    }
  }
)

export const compressImage = createAsyncThunk(
  'image/compress',
  async ({ file, quality }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('quality', quality)
      
      const response = await api.post('/image/compress', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      })
      
      return {
        blob: response.data,
        filename: `compressed-${file.name}`
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to compress image')
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

const imageSlice = createSlice({
  name: 'image',
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
    // Convert Image
    builder
      .addCase(convertImage.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(convertImage.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.downloadUrl = URL.createObjectURL(action.payload.blob)
        state.filename = action.payload.filename
      })
      .addCase(convertImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    
    // Compress Image
    builder
      .addCase(compressImage.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(compressImage.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.downloadUrl = URL.createObjectURL(action.payload.blob)
        state.filename = action.payload.filename
      })
      .addCase(compressImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { resetState, clearError } = imageSlice.actions
export default imageSlice.reducer