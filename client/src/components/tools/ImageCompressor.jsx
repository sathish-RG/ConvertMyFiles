import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileUpload from '../common/FileUpload'
import LoadingSpinner from '../common/LoadingSpinner'
import { compressImage, resetState } from '../../store/slices/imageSlice'
import { Download } from 'lucide-react'

const ImageCompressor = () => {
  const dispatch = useDispatch()
  const { loading, error, success, downloadUrl, filename } = useSelector(state => state.image)
  const [selectedFile, setSelectedFile] = useState(null)
  const [quality, setQuality] = useState(80)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    dispatch(resetState())
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    dispatch(resetState())
  }

  const handleCompress = () => {
    if (selectedFile) {
      dispatch(compressImage({ file: selectedFile, quality }))
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

  const getQualityLabel = (quality) => {
    if (quality >= 90) return 'High Quality'
    if (quality >= 70) return 'Good Quality'
    if (quality >= 50) return 'Medium Quality'
    return 'Low Quality'
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Image Compressed Successfully!</h3>
          <p className="text-gray-600">Your image has been compressed and is ready for download.</p>
        </div>
        
        <button
          onClick={handleDownload}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Download Compressed Image</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FileUpload
        onFileSelect={handleFileSelect}
        accept={{ 
          'image/*': ['.jpg', '.jpeg', '.png', '.webp']
        }}
        selectedFile={selectedFile}
        onRemoveFile={handleRemoveFile}
        disabled={loading}
      />

      {selectedFile && !loading && (
        <div>
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {selectedFile && !loading && (
        <div className="text-center">
          <button
            onClick={handleCompress}
            className="btn-primary"
          >
            Compress Image
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <LoadingSpinner text="Compressing your image..." />
        </div>
      )}
    </div>
  )
}

export default ImageCompressor