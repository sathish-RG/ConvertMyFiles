import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunk for batch image conversion
export const convertBatchImages = createAsyncThunk(
  'batchConvert/convertImages',
  async ({ files, format }, { rejectWithValue }) => {
    try {
      console.log('Starting batch conversion...')
      console.log('Files received:', files)
      console.log('Number of files:', files.length)
      console.log('Target format:', format)
      
      const formData = new FormData()
      
      files.forEach((file, index) => {
        console.log(`Appending file ${index}:`, file.name, file.type, file.size)
        formData.append('images', file)
      })
      
      formData.append('format', format)
      formData.append('outputMode', 'zip')
      
      console.log('FormData entries:')
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }
      
      const response = await api.post('/image/convert-batch', formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          // This will be handled by the progress tracking
        }
      })
      
      return {
        blob: response.data,
        filename: `converted-images-${Date.now()}.zip`,
        downloadUrl: URL.createObjectURL(response.data)
      }
    } catch (error) {
      console.error('Batch conversion error:', error)
      console.error('Error response:', error.response)
      console.error('Error data:', error.response?.data)
      
      // If response is a blob (error), try to read it as text
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text()
        console.error('Error blob text:', text)
        try {
          const errorData = JSON.parse(text)
          return rejectWithValue(errorData.message || 'Failed to convert images')
        } catch (e) {
          return rejectWithValue(text || 'Failed to convert images')
        }
      }
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to convert images'
      )
    }
  }
)

const initialState = {
  files: [],
  targetFormat: 'png',
  loading: false,
  error: null,
  success: false,
  downloadUrl: null,
  filename: null,
  progress: 0,
  stats: {
    total: 0,
    converted: 0,
    failed: 0
  }
}

const batchConvertSlice = createSlice({
  name: 'batchConvert',
  initialState,
  reducers: {
    addFiles: (state, action) => {
      const newFiles = action.payload.filter(
        (newFile) => !state.files.some((file) => file.name === newFile.name)
      )
      state.files = [...state.files, ...newFiles]
      state.stats.total = state.files.length
    },
    removeFile: (state, action) => {
      state.files = state.files.filter((file) => file.id !== action.payload)
      state.stats.total = state.files.length
    },
    clearFiles: (state) => {
      state.files = []
      state.stats = { total: 0, converted: 0, failed: 0 }
    },
    setTargetFormat: (state, action) => {
      state.targetFormat = action.payload
    },
    setProgress: (state, action) => {
      state.progress = action.payload
    },
    resetState: (state) => {
      // Clean up blob URL to prevent memory leaks
      if (state.downloadUrl) {
        URL.revokeObjectURL(state.downloadUrl)
      }
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(convertBatchImages.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
        state.progress = 0
      })
      .addCase(convertBatchImages.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.filename = action.payload.filename
        state.progress = 100
        state.stats.converted = state.files.length
        // Store blob URL in state for download functionality
        state.downloadUrl = action.payload.downloadUrl
      })
      .addCase(convertBatchImages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.progress = 0
        state.stats.failed = state.files.length
      })
  }
})

export const {
  addFiles,
  removeFile,
  clearFiles,
  setTargetFormat,
  setProgress,
  resetState
} = batchConvertSlice.actions

export default batchConvertSlice.reducer
