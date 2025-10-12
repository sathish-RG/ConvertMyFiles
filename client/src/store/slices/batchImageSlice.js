import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunk for batch image compression
export const compressBatchImages = createAsyncThunk(
  'batchImage/compress',
  async ({ files, quality }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      
      // Append all files
      files.forEach((file, index) => {
        formData.append(`images`, file)
      })
      
      formData.append('quality', quality)
      
      const response = await api.post('/image/compress-batch', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      })
      
      return {
        blob: response.data,
        filename: `compressed-images-${Date.now()}.zip`,
        downloadUrl: URL.createObjectURL(response.data)
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to compress images')
    }
  }
)

// Async thunk for individual file compression in batch
export const compressIndividualImage = createAsyncThunk(
  'batchImage/compressIndividual',
  async ({ file, quality, fileId }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('quality', quality)
      
      const response = await api.post('/image/compress', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      })
      
      return {
        fileId,
        blob: response.data,
        filename: `compressed-${file.name}`,
        downloadUrl: URL.createObjectURL(response.data),
        originalFile: file
      }
    } catch (error) {
      return rejectWithValue({
        fileId,
        error: error.response?.data?.message || 'Failed to compress image'
      })
    }
  }
)

const initialState = {
  files: [], // Array of file metadata (serializable data only)
  loading: false,
  error: null,
  success: false,
  downloadUrl: null,
  filename: null,
  progress: {
    completed: 0,
    total: 0,
    currentFile: null
  },
  individualResults: {} // Store individual compression results
}

const batchImageSlice = createSlice({
  name: 'batchImage',
  initialState,
  reducers: {
    addFiles: (state, action) => {
      const newFiles = action.payload.map((fileMetadata) => ({
        ...fileMetadata,
        status: 'pending', // pending, processing, completed, error
        error: null,
        downloadUrl: null,
        filename: null,
        originalSize: fileMetadata.size,
        compressedSize: null
      }))
      state.files = [...state.files, ...newFiles]
    },
    
    removeFile: (state, action) => {
      const fileId = action.payload
      const file = state.files.find(f => f.id === fileId)
      if (file && file.downloadUrl) {
        URL.revokeObjectURL(file.downloadUrl)
      }
      state.files = state.files.filter(f => f.id !== fileId)
      delete state.individualResults[fileId]
    },
    
    clearFiles: (state) => {
      // Clean up blob URLs before clearing
      state.files.forEach(file => {
        if (file.downloadUrl) {
          URL.revokeObjectURL(file.downloadUrl)
        }
      })
      Object.values(state.individualResults).forEach(result => {
        if (result.downloadUrl) {
          URL.revokeObjectURL(result.downloadUrl)
        }
      })
      state.files = []
      state.individualResults = {}
      state.progress = { completed: 0, total: 0, currentFile: null }
    },
    
    updateFileStatus: (state, action) => {
      const { fileId, status, error = null } = action.payload
      const file = state.files.find(f => f.id === fileId)
      if (file) {
        file.status = status
        file.error = error
      }
    },
    
    setQuality: (state, action) => {
      state.quality = action.payload
    },
    
    resetState: (state) => {
      // Clean up blob URLs to prevent memory leaks
      if (state.downloadUrl) {
        URL.revokeObjectURL(state.downloadUrl)
      }
      Object.values(state.individualResults).forEach(result => {
        if (result.downloadUrl) {
          URL.revokeObjectURL(result.downloadUrl)
        }
      })
      return { ...initialState }
    },
    
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Batch compression
    builder
      .addCase(compressBatchImages.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
        state.progress.total = state.files.length
        state.progress.completed = 0
      })
      .addCase(compressBatchImages.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.downloadUrl = action.payload.downloadUrl
        state.filename = action.payload.filename
        state.files.forEach(file => {
          file.status = 'completed'
        })
        state.progress.completed = state.progress.total
      })
      .addCase(compressBatchImages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.files.forEach(file => {
          if (file.status === 'processing') {
            file.status = 'error'
            file.error = action.payload
          }
        })
      })
    
    // Individual file compression
    builder
      .addCase(compressIndividualImage.pending, (state, action) => {
        const { fileId } = action.meta.arg
        const file = state.files.find(f => f.id === fileId)
        if (file) {
          file.status = 'processing'
        }
        state.progress.currentFile = fileId
      })
      .addCase(compressIndividualImage.fulfilled, (state, action) => {
        const { fileId, blob, filename, downloadUrl } = action.payload
        const file = state.files.find(f => f.id === fileId)
        if (file) {
          file.status = 'completed'
          file.downloadUrl = downloadUrl
          file.filename = filename
          file.compressedSize = blob.size
        }
        state.individualResults[fileId] = {
          filename,
          downloadUrl
        }
        state.progress.completed += 1
      })
      .addCase(compressIndividualImage.rejected, (state, action) => {
        const { fileId, error } = action.payload
        const file = state.files.find(f => f.id === fileId)
        if (file) {
          file.status = 'error'
          file.error = error
        }
        state.progress.completed += 1
      })
  }
})

export const { 
  addFiles, 
  removeFile, 
  clearFiles, 
  updateFileStatus, 
  setQuality, 
  resetState, 
  clearError 
} = batchImageSlice.actions

export default batchImageSlice.reducer
