import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, AlertCircle } from 'lucide-react'

const FileUpload = ({ 
  onFileSelect, 
  accept, 
  maxSize = 50 * 1024 * 1024, // 50MB
  selectedFile,
  onRemoveFile,
  disabled = false,
  multiple = false,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      const errorCode = rejection.errors[0]?.code
      
      let errorMessage = 'File rejected'
      switch (errorCode) {
        case 'file-too-large':
          errorMessage = `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`
          break
        case 'file-invalid-type':
          errorMessage = 'Invalid file type'
          break
        case 'too-many-files':
          errorMessage = 'Only one file allowed'
          break
        default:
          errorMessage = rejection.errors[0]?.message || 'File rejected'
      }
      
      setError(errorMessage)
      return
    }
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      
      // Additional validation
      if (file.size > maxSize) {
        setError(`File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`)
        return
      }
      
      onFileSelect(file)
    }
  }, [onFileSelect, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getAcceptedFormats = () => {
    if (!accept) return 'All files'
    
    const extensions = Object.values(accept).flat()
    return extensions.join(', ').toUpperCase()
  }

  if (selectedFile) {
    return (
      <div className={`card ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <File className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{formatFileSize(selectedFile.size)}</span>
                <span>•</span>
                <span>{selectedFile.type || 'Unknown type'}</span>
              </div>
            </div>
          </div>
          {!disabled && onRemoveFile && (
            <button
              onClick={onRemoveFile}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`
          dropzone relative
          ${isDragActive || dragActive ? 'active border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          transition-all duration-200 ease-in-out
        `}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
          
          {isDragActive ? (
            <div>
              <p className="text-primary-600 font-medium mb-2">Drop the file here</p>
              <p className="text-sm text-primary-500">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 font-medium mb-2">
                Drag & drop a file here, or <span className="text-primary-600">click to select</span>
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Supported formats: {getAcceptedFormats()}</p>
                <p>Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Loading overlay */}
        {disabled && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Processing...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}

export default FileUpload