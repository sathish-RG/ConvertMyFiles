import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MultiFileUpload from '../common/MultiFileUpload'
import LoadingSpinner from '../common/LoadingSpinner'
import fileManager from '../../utils/fileManager'
import {
  addFiles,
  removeFile,
  clearFiles,
  compressIndividualPDF,
  compressBatchPDFs,
  resetState,
  setCompressionOptions
} from '../../store/slices/batchPDFSlice'
import { Download, Archive, FileText, CheckCircle, XCircle, Clock, Settings, Zap, X } from 'lucide-react'

const BatchPDFCompressor = () => {
  const dispatch = useDispatch()
  const {
    files,
    loading,
    error,
    success,
    downloadUrl,
    filename,
    progress,
    individualResults,
    compressionOptions
  } = useSelector(state => state.batchPDF)

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
      dispatch(compressBatchPDFs({ files: fileObjects, options: compressionOptions }))
    } else {
      // Compress files individually
      for (const fileObj of files) {
        if (fileObj.status === 'pending') {
          const actualFile = fileManager.getFile(fileObj.id)
          if (actualFile) {
            dispatch(compressIndividualPDF({
              file: actualFile,
              options: compressionOptions,
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

  const handleOptionsChange = (option, value) => {
    dispatch(setCompressionOptions({ [option]: value }))
  }

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">PDFs Compressed Successfully!</h3>
          <p className="text-gray-600">
            Your PDFs have been compressed and are ready for download.
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Archive className="h-5 w-5" />
          <span>Download All ({files.length} files)</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Compression Options */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Compression Options</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compression Level
            </label>
            <select
              value={compressionOptions.compressionLevel}
              onChange={(e) => handleOptionsChange('compressionLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low (Fastest, larger file)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Slower, smaller file)</option>
              <option value="extreme">Extreme (Slowest, smallest file)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Mode
            </label>
            <select
              value={compressionOptions.outputMode}
              onChange={(e) => handleOptionsChange('outputMode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="zip">ZIP Archive</option>
              <option value="individual">Individual Files</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="removeImages"
              checked={compressionOptions.removeImages}
              onChange={(e) => handleOptionsChange('removeImages', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="removeImages" className="ml-2 text-sm text-gray-700">
              Remove embedded images
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="removeMetadata"
              checked={compressionOptions.removeMetadata}
              onChange={(e) => handleOptionsChange('removeMetadata', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="removeMetadata" className="ml-2 text-sm text-gray-700">
              Remove metadata
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="optimizeForWeb"
              checked={compressionOptions.optimizeForWeb}
              onChange={(e) => handleOptionsChange('optimizeForWeb', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="optimizeForWeb" className="ml-2 text-sm text-gray-700">
              Optimize for web
            </label>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
        <MultiFileUpload
          onFilesSelect={handleFilesSelect}
          accept={{ 'application/pdf': ['.pdf'] }}
          selectedFiles={files.map(f => ({ file: { name: f.name, size: f.size } }))}
          onRemoveFile={handleRemoveFile}
          disabled={loading}
          maxFiles={20}
        />

        {files.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            <p>Total files: {files.length} | Total size: {formatFileSize(getTotalSize())}</p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Compression Mode Selection */}
      {files.length > 0 && !loading && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Compression Mode</h4>
              <p className="text-sm text-gray-600">
                Choose how you want to compress your PDFs
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCompressionMode('individual')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  compressionMode === 'individual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setCompressionMode('batch')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  compressionMode === 'batch'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                Batch (ZIP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compression Controls */}
      {files.length > 0 && !loading && (
        <div className="text-center">
          <button
            onClick={handleCompress}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Zap className="h-5 w-5" />
            <span>
              {compressionMode === 'batch' ? 'Compress All to ZIP' : 'Compress All Files'}
            </span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <LoadingSpinner text={`Compressing PDFs (${progress.completed}/${progress.total})...`} />
        </div>
      )}

      {/* File Progress List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Files ({files.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.status === 'pending' && (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                  {file.status === 'processing' && (
                    <LoadingSpinner className="h-4 w-4" />
                  )}
                  {file.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}

                  {file.status === 'completed' && individualResults[file.id] && (
                    <button
                      onClick={() => handleDownloadIndividual(file.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Download individual file"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {files.length > 1 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              Clear all files
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default BatchPDFCompressor
