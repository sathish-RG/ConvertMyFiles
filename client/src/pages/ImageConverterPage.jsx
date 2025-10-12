import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ToolLayout from '../components/layout/ToolLayout'
import FileUpload from '../components/common/FileUpload'
import LoadingSpinner from '../components/common/LoadingSpinner'
import BatchImageConverter from '../components/tools/BatchImageConverter'
import { convertImage, resetState } from '../store/slices/imageSlice'
import { resetState as resetBatchState } from '../store/slices/batchConvertSlice'
import { Download, Image as ImageIcon, FolderOpen } from 'lucide-react'
import { SUPPORTED_IMAGE_FORMATS } from '../utils/constants'

const ImageConverterPage = () => {
  const dispatch = useDispatch()
  const { loading, error, success, downloadUrl, filename } = useSelector(state => state.image)
  const [selectedFile, setSelectedFile] = useState(null)
  const [targetFormat, setTargetFormat] = useState('png')
  const [mode, setMode] = useState('single') // 'single' or 'bulk'

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleConvert = () => {
    if (selectedFile) {
      dispatch(convertImage({ file: selectedFile, format: targetFormat }))
    }
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
    setSelectedFile(null)
    setTargetFormat('png')
    if (mode === 'bulk') {
      dispatch(resetBatchState())
    }
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setSelectedFile(null)
    dispatch(resetState())
    dispatch(resetBatchState())
  }

  return (
    <ToolLayout
      title="Image Converter"
      description="Convert images between different formats. Support for JPG, PNG, WebP, GIF, and PDF."
      onReset={handleReset}
      resetAction={mode === 'single' ? resetState : resetBatchState}
    >
      {/* Mode Toggle */}
      <div className="card p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Conversion Mode</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleModeChange('single')}
            className={`p-3 border rounded-lg text-left transition-colors ${
              mode === 'single'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <ImageIcon className="h-5 w-5" />
              <span className="font-medium">Single Image</span>
            </div>
            <p className="text-sm text-gray-600">
              Convert one image at a time
            </p>
          </button>
          
          <button
            onClick={() => handleModeChange('bulk')}
            className={`p-3 border rounded-lg text-left transition-colors ${
              mode === 'bulk'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <FolderOpen className="h-5 w-5" />
              <span className="font-medium">Bulk Conversion</span>
            </div>
            <p className="text-sm text-gray-600">
              Convert multiple images (up to 20)
            </p>
          </button>
        </div>
      </div>

      {/* Single Image Mode */}
      {mode === 'single' && (
        <>
          {!success ? (
            <div className="space-y-6">
              <FileUpload
                onFileSelect={handleFileSelect}
                accept={{ 
                  'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif']
                }}
                selectedFile={selectedFile}
                onRemoveFile={handleRemoveFile}
                disabled={loading}
              />

              {selectedFile && !loading && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Convert to Format
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {SUPPORTED_IMAGE_FORMATS.map((format) => (
                      <button
                        key={format}
                        onClick={() => setTargetFormat(format)}
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
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {selectedFile && !loading && (
                <div className="text-center">
                  <button
                    onClick={handleConvert}
                    className="btn-primary"
                  >
                    Convert Image
                  </button>
                </div>
              )}

              {loading && (
                <div className="text-center py-8">
                  <LoadingSpinner text="Converting your image..." />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Image Converted Successfully!</h3>
                <p className="text-gray-600">Your image has been converted and is ready for download.</p>
              </div>
              
              <button
                onClick={handleDownload}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download Converted Image</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Bulk Conversion Mode */}
      {mode === 'bulk' && <BatchImageConverter />}
    </ToolLayout>
  )
}

export default ImageConverterPage