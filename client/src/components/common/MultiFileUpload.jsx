import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, AlertCircle, Plus } from 'lucide-react'

const MultiFileUpload = ({ 
  onFilesSelect, 
  accept, 
  maxSize = 50 * 1024 * 1024, // 50MB per file
  selectedFiles = [],
  onRemoveFile,
  disabled = false,
  className = "",
  maxFiles = 10
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
          errorMessage = `Maximum ${maxFiles} files allowed`
          break
        default:
          errorMessage = rejection.errors[0]?.message || 'File rejected'
      }
      
      setError(errorMessage)
      return
    }
    
    if (acceptedFiles.length > 0) {
      // Check if adding these files would exceed the limit
      if (selectedFiles.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed. You can add ${maxFiles - selectedFiles.length} more files.`)
        return
      }
      
      // Filter out duplicates based on name and size
      const newFiles = acceptedFiles.filter(newFile => 
        !selectedFiles.some(existingFile => 
          existingFile.file.name === newFile.name && 
          existingFile.file.size === newFile.size
        )
      )
      
      if (newFiles.length === 0) {
        setError('All selected files are already added')
        return
      }
      
      onFilesSelect(newFiles)
    }
  }, [onFilesSelect, maxSize, selectedFiles, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: true,
    disabled,
    maxFiles: maxFiles - selectedFiles.length,
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

  const getTotalSize = () => {
    return selectedFiles.reduce((total, fileObj) => total + fileObj.file.size, 0)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Selected Files ({selectedFiles.length}/{maxFiles})
            </h4>
            <div className="text-sm text-gray-500">
              Total: {formatFileSize(getTotalSize())}
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {selectedFiles.map((fileObj) => (
              <div key={fileObj.id} className="card p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <File className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {fileObj.file.name}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{formatFileSize(fileObj.file.size)}</span>
                        <span>•</span>
                        <span>{fileObj.file.type || 'Unknown type'}</span>
                        {fileObj.status && (
                          <>
                            <span>•</span>
                            <span className={`capitalize ${
                              fileObj.status === 'completed' ? 'text-green-600' :
                              fileObj.status === 'processing' ? 'text-blue-600' :
                              fileObj.status === 'error' ? 'text-red-600' :
                              'text-gray-500'
                            }`}>
                              {fileObj.status}
                            </span>
                          </>
                        )}
                      </div>
                      {fileObj.error && (
                        <p className="text-xs text-red-600 mt-1">{fileObj.error}</p>
                      )}
                    </div>
                  </div>
                  {!disabled && onRemoveFile && (
                    <button
                      onClick={() => onRemoveFile(fileObj.id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      {selectedFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            dropzone relative
            ${isDragActive || dragActive ? 'active border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${selectedFiles.length > 0 ? 'py-6' : 'py-12'}
            transition-all duration-200 ease-in-out
          `}
        >
          <input {...getInputProps()} />
          
          <div className="text-center">
            {selectedFiles.length > 0 ? (
              <Plus className={`h-8 w-8 mx-auto mb-3 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
            ) : (
              <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
            )}
            
            {isDragActive ? (
              <div>
                <p className="text-primary-600 font-medium mb-2">Drop the files here</p>
                <p className="text-sm text-primary-500">Release to upload</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 font-medium mb-2">
                  {selectedFiles.length > 0 ? (
                    <>Add more files or <span className="text-primary-600">click to select</span></>
                  ) : (
                    <>Drag & drop files here, or <span className="text-primary-600">click to select</span></>
                  )}
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Supported formats: {getAcceptedFormats()}</p>
                  <p>Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB</p>
                  <p>Maximum files: {maxFiles} ({maxFiles - selectedFiles.length} remaining)</p>
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
      )}
      
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

export default MultiFileUpload
