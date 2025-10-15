import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunk for Word to PDF conversion
export const wordToPDF = createAsyncThunk(
  'wordToPDF/convert',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('word', file)

      // Use the uploadFile helper for file downloads
      const response = await api.post('/pdf/word-to-pdf', formData, {
        responseType: 'blob', // Important for file downloads
      })

      // Create download URL for the PDF blob
      const downloadUrl = URL.createObjectURL(response.data)

      return {
        downloadUrl,
        filename: `converted-${file.name.replace(/\.[^/.]+$/, '.pdf')}`,
        success: true
      }
    } catch (error) {
      console.error('Word to PDF conversion error:', error)
      let errorMessage = 'Failed to convert Word to PDF'
      
      if (error.response?.data) {
        // If the error response is a blob (HTML error page), convert it to text
        if (error.response.data instanceof Blob) {
          try {
            const errorText = await error.response.data.text()
            // Try to parse JSON error message
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.message || errorMessage
          } catch (parseError) {
            // If parsing fails, use default message
            errorMessage = 'Failed to convert Word to PDF. Please check your file format.'
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return rejectWithValue(errorMessage)
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

const wordToPDFSlice = createSlice({
  name: 'wordToPDF',
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
    builder
      .addCase(wordToPDF.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(wordToPDF.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.downloadUrl = action.payload.downloadUrl
        state.filename = action.payload.filename
      })
      .addCase(wordToPDF.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { resetState, clearError } = wordToPDFSlice.actions
export default wordToPDFSlice.reducer
