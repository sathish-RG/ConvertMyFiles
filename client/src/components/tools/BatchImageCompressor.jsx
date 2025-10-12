import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MultiFileUpload from '../common/MultiFileUpload'
import LoadingSpinner from '../common/LoadingSpinner'
import fileManager from '../../utils/fileManager'
import { 
  addFiles, 
  removeFile, 
  clearFiles, 
  compressIndividualImage,
  compressBatchImages,
  resetState 
} from '../../store/slices/batchImageSlice'
import { Download, Archive, Image, CheckCircle, XCircle, Clock, Zap } from 'lucide-react'

const BatchImageCompressor = () => {
  const dispatch = useDispatch()
  const { 
    files, 
    loading, 
    error, 
    success, 
    downloadUrl, 
    filename, 
    progress,
    individualResults 
  } = useSelector(state => state.batchImage)
  
  const [quality, setQuality] = useState(80)
  const [compressionMode, setCompressionMode] = useState('individual') // 'individual' or 'batch'

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

  const handleCompress = async () => {
    if (files.length === 0) return

    if (compressionMode === 'batch') {
      // Compress all files and return as ZIP
      const fileObjects = files.map(f => fileManager.getFile(f.id)).filter(Boolean)
      dispatch(compressBatchImages({ files: fileObjects, quality }))
    } else {
      // Compress files individually
      for (const fileObj of files) {
        if (fileObj.status === 'pending') {
          const actualFile = fileManager.getFile(fileObj.id)
          if (actualFile) {
            dispatch(compressIndividualImage({ 
              file: actualFile, 
              quality, 
              fileId: fileObj.id 
            }))
          }
        }
      }
    }
  }

  const handleDownloadAll = () => {
    if (downloadUrl && filename) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleDownloadIndividual = (fileId) => {
    const result = individualResults[fileId]
    if (result && result.downloadUrl) {
      const link = document.createElement('a')
      link.href = result.downloadUrl
      link.download = result.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getQualityLabel = (quality) => {
    if (quality >= 90) return 'High Quality'
    if (quality >= 70) return 'Good Quality'
    if (quality >= 50) return 'Medium Quality'
    return 'Low Quality'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Image className="h-5 w-5 text-gray-400" />
    }
  }

  const getCompletedCount = () => {
    return files.filter(f => f.status === 'completed').length
  }

  const getErrorCount = () => {
    return files.filter(f => f.status === 'error').length
  }

  const getTotalOriginalSize = () => {
    return files.reduce((total, f) => total + f.originalSize, 0)
  }

  const getTotalCompressedSize = () => {
    return files.reduce((total, f) => total + (f.compressedSize || 0), 0)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getSavingsPercentage = () => {
    const original = getTotalOriginalSize()
    const compressed = getTotalCompressedSize()
    if (original === 0 || compressed === 0) return 0
    return Math.round(((original - compressed) / original) * 100)
  }

  // Show success state for batch compression
  if (success && compressionMode === 'batch') {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Archive className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Images Compressed Successfully!
          </h3>
          <p className="text-gray-600">
            All {files.length} images have been compressed and packaged into a ZIP file.
          </p>
        </div>
        
        <button
          onClick={handleDownloadAll}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Download ZIP File</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Compression Mode Selection */}
      <div className="card p-4">
        <h3 className="font-medium text-gray-900 mb-3">Compression Mode</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCompressionMode('individual')}
            className={`p-3 border rounded-lg text-left transition-colors ${
              compressionMode === 'individual'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Image className="h-5 w-5" />
              <span className="font-medium">Individual Files</span>
            </div>
            <p className="text-sm text-gray-600">
              Compress each image separately and download individually
            </p>
          </button>
          
          <button
            onClick={() => setCompressionMode('batch')}
            className={`p-3 border rounded-lg text-left transition-colors ${
              compressionMode === 'batch'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Archive className="h-5 w-5" />
              <span className="font-medium">ZIP Archive</span>
            </div>
            <p className="text-sm text-gray-600">
              Compress all images and download as a single ZIP file
            </p>
          </button>
        </div>
      </div>

      {/* File Upload */}
      <MultiFileUpload
        onFilesSelect={handleFilesSelect}
        accept={{ 
          'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif']
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

      {/* Quality Settings */}
      {files.length > 0 && !loading && (
        <div className="card p-4">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Compression Quality: {quality}% ({getQualityLabel(quality)})
          </label>
          <div className="space-y-4">
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[30, 50, 70, 90].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setQuality(preset)}
                  className={`p-2 text-xs border rounded transition-colors ${
                    quality === preset
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{files.length}</div>
            <div className="text-sm text-gray-600">Total Files</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{getCompletedCount()}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{getErrorCount()}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{getSavingsPercentage()}%</div>
            <div className="text-sm text-gray-600">Size Reduction</div>
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
            onClick={handleCompress}
            className="btn-primary flex-1 inline-flex items-center justify-center space-x-2"
          >
            <Zap className="h-5 w-5" />
            <span>
              {compressionMode === 'batch' 
                ? `Compress All (${files.length} files)` 
                : `Compress ${files.length} Images`
              }
            </span>
          </button>
          
          <button
            onClick={handleClearAll}
            className="btn-secondary"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Individual Results for Individual Mode */}
      {compressionMode === 'individual' && files.some(f => f.status === 'completed') && (
        <div className="card p-4">
          <h3 className="font-medium text-gray-900 mb-4">Compression Results</h3>
          <div className="space-y-3">
            {files.filter(f => f.status === 'completed').map((fileObj) => (
              <div key={fileObj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(fileObj.status)}
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{fileObj.name}</p>
                    <p className="text-xs text-gray-600">
                      {formatFileSize(fileObj.originalSize)} → {formatFileSize(fileObj.compressedSize || 0)}
                      {fileObj.compressedSize && (
                        <span className="text-green-600 ml-2">
                          (-{Math.round(((fileObj.originalSize - fileObj.compressedSize) / fileObj.originalSize) * 100)}%)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadIndividual(fileObj.id)}
                  className="btn-secondary btn-sm inline-flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <LoadingSpinner 
            text={compressionMode === 'batch' 
              ? `Compressing ${files.length} images...` 
              : `Compressing images... (${progress.completed}/${progress.total})`
            } 
          />
          {compressionMode === 'individual' && progress.total > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {progress.completed} of {progress.total} files completed
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BatchImageCompressor
