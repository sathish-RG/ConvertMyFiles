import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MultiFileUpload from '../common/MultiFileUpload'
import LoadingSpinner from '../common/LoadingSpinner'
import fileManager from '../../utils/fileManager'
import { 
  addFiles, 
  removeFile, 
  clearFiles, 
  setTargetFormat,
  convertBatchImages,
  resetState 
} from '../../store/slices/batchConvertSlice'
import { Download, Archive, Image, CheckCircle, RefreshCw } from 'lucide-react'
import { SUPPORTED_IMAGE_FORMATS } from '../../utils/constants'

const BatchImageConverter = () => {
  const dispatch = useDispatch()
  const { 
    files, 
    targetFormat,
    loading, 
    error, 
    success, 
    downloadUrl, 
    filename,
    stats
  } = useSelector(state => state.batchConvert)

  const handleFilesSelect = (newFiles) => {
    // Store actual File objects in file manager
    const fileMetadata = newFiles.map((file, index) => {
      const fileId = `${Date.now()}-${index}`
      fileManager.addFile(fileId, file)
      return {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      }
    })
    
    dispatch(addFiles(fileMetadata))
  }

  const handleRemoveFile = (fileId) => {
    fileManager.removeFile(fileId)
    dispatch(removeFile(fileId))
  }

  const handleClearAll = () => {
    fileManager.clear()
    dispatch(clearFiles())
  }

  const handleConvert = async () => {
    if (files.length === 0) return

    // Get actual file objects from file manager
    const fileObjects = files.map(f => fileManager.getFile(f.id)).filter(Boolean)
    console.log('Files to convert:', fileObjects.length)
    console.log('Target format:', targetFormat)
    
    if (fileObjects.length === 0) {
      console.error('No file objects found in fileManager')
      return
    }
    
    dispatch(convertBatchImages({ files: fileObjects, format: targetFormat }))
  }

  const handleDownload = () => {
    if (downloadUrl && filename) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleReset = () => {
    fileManager.clear()
    dispatch(resetState())
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Show success state
  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Archive className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Images Converted Successfully!
          </h3>
          <p className="text-gray-600 mb-4">
            All {stats.converted} images have been converted to {targetFormat.toUpperCase()} format and packaged into a ZIP file.
          </p>
          {stats.failed > 0 && (
            <p className="text-amber-600 text-sm">
              Note: {stats.failed} file(s) failed to convert
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download ZIP File</span>
          </button>
          
          <button
            onClick={handleReset}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Convert More Images</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <MultiFileUpload
        onFilesSelect={handleFilesSelect}
        accept={{ 
          'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff']
        }}
        selectedFiles={files.map(f => ({
          ...f,
          file: {
            name: f.name,
            size: f.size,
            type: f.type,
            lastModified: f.lastModified
          }
        }))}
        onRemoveFile={handleRemoveFile}
        disabled={loading}
        maxFiles={20}
      />

      {/* Format Selection */}
      {files.length > 0 && !loading && (
        <div className="card p-4">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Convert to Format
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {SUPPORTED_IMAGE_FORMATS.map((format) => (
              <button
                key={format}
                onClick={() => dispatch(setTargetFormat(format))}
                className={`p-3 border-2 rounded-lg text-center font-medium transition-colors ${
                  targetFormat === format
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            All {files.length} images will be converted to {targetFormat.toUpperCase()} format
          </p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && !loading && (
        <div className="card p-4">
          <h3 className="font-medium text-gray-900 mb-4">
            Selected Files ({files.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Image className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{fileObj.name}</p>
                    <p className="text-xs text-gray-600">
                      {formatFileSize(fileObj.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile(fileObj.id)}
                  className="text-red-600 hover:text-red-700 text-sm ml-2 flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      {files.length > 0 && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{files.length}</div>
            <div className="text-sm text-gray-600">Total Files</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{targetFormat.toUpperCase()}</div>
            <div className="text-sm text-gray-600">Target Format</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024)}MB
            </div>
            <div className="text-sm text-gray-600">Total Size</div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && !loading && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConvert}
            className="btn-primary flex-1 inline-flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Convert All to {targetFormat.toUpperCase()}</span>
          </button>
          
          <button
            onClick={handleClearAll}
            className="btn-secondary"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <LoadingSpinner text={`Converting ${files.length} images to ${targetFormat.toUpperCase()}...`} />
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300 animate-pulse"
                style={{ width: '100%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Please wait while we process your images...
            </p>
          </div>
        </div>
      )}

      {/* Info Box */}
      {files.length === 0 && !loading && (
        <div className="card p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Archive className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Bulk Image Converter</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload up to 20 images at once</li>
                <li>• Convert to JPG, PNG, WebP, GIF, or PDF</li>
                <li>• All converted images packaged in a ZIP file</li>
                <li>• Fast batch processing</li>
                <li>• Supports multiple image formats</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BatchImageConverter
