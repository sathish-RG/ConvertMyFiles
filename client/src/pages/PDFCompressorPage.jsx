import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ToolLayout from '../components/layout/ToolLayout'
import SEO from '../components/common/SEO'
import { seoConfig } from '../utils/seoConfig'
import FileUpload from '../components/common/FileUpload'
import LoadingSpinner from '../components/common/LoadingSpinner'
import BatchPDFCompressor from '../components/tools/BatchPDFCompressor'
import PDFCompressor from '../components/tools/PDFCompressor'
import { compressAdvancedPDF, resetState } from '../store/slices/pdfSlice'
import { resetState as resetBatchState } from '../store/slices/batchPDFSlice'
import { Download, FileText, Layers } from 'lucide-react'

const PDFCompressorPage = () => {
  const dispatch = useDispatch()
  const { loading, error, success, downloadUrl, filename } = useSelector(state => state.pdf)
  const [selectedFile, setSelectedFile] = useState(null)
  const [mode, setMode] = useState('single') // 'single' or 'batch'
  const [compressionOptions, setCompressionOptions] = useState({
    compressionLevel: 'medium',
    removeImages: false,
    removeFonts: false,
    removeMetadata: false,
    optimizeForWeb: false
  })

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleCompress = () => {
    if (selectedFile) {
      dispatch(compressAdvancedPDF({ file: selectedFile, options: compressionOptions }))
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
    setCompressionOptions({
      compressionLevel: 'medium',
      removeImages: false,
      removeFonts: false,
      removeMetadata: false,
      optimizeForWeb: false
    })
    if (mode === 'batch') {
      dispatch(resetBatchState())
    }
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    // Reset states when switching modes
    setSelectedFile(null)
    setCompressionOptions({
      compressionLevel: 'medium',
      removeImages: false,
      removeFonts: false,
      removeMetadata: false,
      optimizeForWeb: false
    })
    dispatch(resetState())
    dispatch(resetBatchState())
  }

  return (
    <>
      <SEO {...seoConfig.pdfCompressor} />
      <ToolLayout
      title="PDF Compressor"
      description="Reduce your PDF file size without losing quality. Perfect for sharing and uploading documents."
      onReset={handleReset}
      resetAction={mode === 'single' ? resetState : resetBatchState}
    >
      {/* Mode Toggle */}
      <div className="card p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Compression Mode</h3>
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
              <FileText className="h-5 w-5" />
              <span className="font-medium">Single PDF</span>
            </div>
            <p className="text-sm text-gray-600">
              Compress one PDF at a time
            </p>
          </button>

          <button
            onClick={() => handleModeChange('batch')}
            className={`p-3 border rounded-lg text-left transition-colors ${
              mode === 'batch'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Layers className="h-5 w-5" />
              <span className="font-medium">Batch Compression</span>
            </div>
            <p className="text-sm text-gray-600">
              Compress multiple PDFs simultaneously
            </p>
          </button>
        </div>
      </div>

      {mode === 'single' ? (
        // Single PDF Mode
        !success ? (
          <div className="space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'application/pdf': ['.pdf']
              }}
              selectedFile={selectedFile}
              onRemoveFile={handleRemoveFile}
              disabled={loading}
            />

            {selectedFile && !loading && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Compression Options</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compression Level
                    </label>
                    <select
                      value={compressionOptions.compressionLevel}
                      onChange={(e) => setCompressionOptions({...compressionOptions, compressionLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low (Fastest, larger file)</option>
                      <option value="medium">Medium (Balanced)</option>
                      <option value="high">High (Slower, smaller file)</option>
                      <option value="extreme">Extreme (Slowest, smallest file)</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="removeImages"
                      checked={compressionOptions.removeImages}
                      onChange={(e) => setCompressionOptions({...compressionOptions, removeImages: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="removeImages" className="ml-2 text-sm text-gray-700">
                      Remove embedded images
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="removeFonts"
                      checked={compressionOptions.removeFonts}
                      onChange={(e) => setCompressionOptions({...compressionOptions, removeFonts: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="removeFonts" className="ml-2 text-sm text-gray-700">
                      Remove embedded fonts
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="removeMetadata"
                      checked={compressionOptions.removeMetadata}
                      onChange={(e) => setCompressionOptions({...compressionOptions, removeMetadata: e.target.checked})}
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
                      onChange={(e) => setCompressionOptions({...compressionOptions, optimizeForWeb: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="optimizeForWeb" className="ml-2 text-sm text-gray-700">
                      Optimize for web
                    </label>
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
                  Compress PDF
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <LoadingSpinner text="Compressing your PDF..." />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Compressed Successfully!</h3>
              <p className="text-gray-600">Your PDF has been compressed and is ready for download.</p>
            </div>

            <button
              onClick={handleDownload}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Download Compressed PDF</span>
            </button>
          </div>
        )
      ) : (
        // Batch Mode
        <BatchPDFCompressor />
      )}
    </ToolLayout>
    </>
  )
}

export default PDFCompressorPage