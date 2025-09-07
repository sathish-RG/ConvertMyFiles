// client/src/services/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for large file uploads
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log request for debugging (remove in production)
    if (import.meta.env.DEV) {
      console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url)
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful response for debugging (remove in production)
    if (import.meta.env.DEV) {
      console.log('API Response:', response.status, response.config.url)
    }
    return response
  },
  (error) => {
    console.error('API Error:', error)
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          return Promise.reject(new Error(data?.message || 'Bad request'))
        case 401:
          return Promise.reject(new Error('Unauthorized access'))
        case 403:
          return Promise.reject(new Error('Forbidden access'))
        case 404:
          return Promise.reject(new Error('Resource not found'))
        case 413:
          return Promise.reject(new Error('File too large'))
        case 429:
          return Promise.reject(new Error('Too many requests. Please try again later.'))
        case 500:
          return Promise.reject(new Error('Internal server error'))
        default:
          return Promise.reject(new Error(data?.message || 'An error occurred'))
      }
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'))
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || 'Request failed'))
    }
  }
)

// API endpoints
export const endpoints = {
  // PDF endpoints
  pdf: {
    compress: '/pdf/compress',
    split: '/pdf/split',
    rotate: '/pdf/rotate',
    convertToWord: '/pdf/pdf-to-word',
  },
  // Image endpoints
  image: {
    convert: '/image/convert',
    compress: '/image/compress',
  },
  // Health check
  health: '/health',
}

// Helper functions for different types of requests

// Upload file with form data
export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const formData = new FormData()
  
  // Add file to form data
  if (endpoint.includes('pdf')) {
    formData.append('pdf', file)
  } else if (endpoint.includes('image')) {
    formData.append('image', file)
  }
  
  // Add additional data
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key])
  })
  
  return await api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob', // Important for file downloads
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      console.log(`Upload progress: ${percentCompleted}%`)
    },
  })
}

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get(endpoints.health)
    return response.data
  } catch (error) {
    throw new Error('Server is not responding')
  }
}

// PDF API functions
export const pdfAPI = {
  compress: (file) => uploadFile(endpoints.pdf.compress, file),
  split: (file, startPage, endPage) => uploadFile(endpoints.pdf.split, file, { startPage, endPage }),
  rotate: (file, rotation) => uploadFile(endpoints.pdf.rotate, file, { rotation }),
  convertToWord: (file) => uploadFile(endpoints.pdf.convertToWord, file),
}

// Image API functions
export const imageAPI = {
  convert: (file, format) => uploadFile(endpoints.image.convert, file, { format }),
  compress: (file, quality) => uploadFile(endpoints.image.compress, file, { quality }),
}

// Utility function to create download URL from blob
export const createDownloadUrl = (blob) => {
  return URL.createObjectURL(blob)
}

// Utility function to trigger download
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL object
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 100)
}

// File validation utilities
export const validateFile = {
  pdf: (file) => {
    const validTypes = ['application/pdf']
    const maxSize = 50 * 1024 * 1024 // 50MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Please select a valid PDF file')
    }
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 50MB')
    }
    
    return true
  },
  
  image: (file) => {
    const validTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ]
    const maxSize = 50 * 1024 * 1024 // 50MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Please select a valid image file (JPG, PNG, WebP, GIF)')
    }
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 50MB')
    }
    
    return true
  }
}

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// Generate unique filename
export const generateFilename = (originalName, prefix = '', suffix = '') => {
  const timestamp = Date.now()
  const extension = getFileExtension(originalName)
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  
  return `${prefix}${nameWithoutExt}${suffix ? '-' + suffix : ''}-${timestamp}.${extension}`
}

export default api