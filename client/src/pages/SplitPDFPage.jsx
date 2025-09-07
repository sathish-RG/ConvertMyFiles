import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ToolLayout from '../components/layout/ToolLayout'
import FileUpload from '../components/common/FileUpload'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { splitPDF, resetState } from '../store/slices/pdfSlice'
import { Download } from 'lucide-react'

const SplitPDFPage = () => {
  const dispatch = useDispatch()
  const { loading, error, success, downloadUrl, filename } = useSelector(state => state.pdf)
  const [selectedFile, setSelectedFile] = useState(null)
  const [startPage, setStartPage] = useState(1)
  const [endPage, setEndPage] = useState('')

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleSplit = () => {
    if (selectedFile) {
      dispatch(splitPDF({ file: selectedFile, startPage, endPage }))
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
    setStartPage(1)
    setEndPage('')
  }

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract specific pages from your PDF documents. Choose page ranges to create new PDF files."
      onReset={handleReset}
      resetAction={resetState}
    >
      {!success ? (
        <div className="space-y-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            accept={{ 'application/pdf': ['.pdf'] }}
            selectedFile={selectedFile}
            onRemoveFile={handleRemoveFile}
            disabled={loading}
          />

          {selectedFile && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Page
                </label>
                <input
                  type="number"
                  min="1"
                  value={startPage}
                  onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                  className="input-field"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Page (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={endPage}
                  onChange={(e) => setEndPage(e.target.value)}
                  className="input-field"
                  placeholder="Last page"
                />
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
                onClick={handleSplit}
                className="btn-primary"
              >
                Split PDF
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <LoadingSpinner text="Splitting your PDF..." />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Split Successfully!</h3>
            <p className="text-gray-600">Your PDF has been split and is ready for download.</p>
          </div>
          
          <button
            onClick={handleDownload}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download Split PDF</span>
          </button>
        </div>
      )}
    </ToolLayout>
  )
}

export default SplitPDFPage