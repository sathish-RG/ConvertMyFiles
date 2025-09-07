import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ToolLayout from '../components/layout/ToolLayout'
import FileUpload from '../components/common/FileUpload'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { rotatePDF, resetState } from '../store/slices/pdfSlice'
import { Download, RotateCw } from 'lucide-react'

const RotatePDFPage = () => {
  const dispatch = useDispatch()
  const { loading, error, success, downloadUrl, filename } = useSelector(state => state.pdf)
  const [selectedFile, setSelectedFile] = useState(null)
  const [rotation, setRotation] = useState(90)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleRotate = () => {
    if (selectedFile) {
      dispatch(rotatePDF({ file: selectedFile, rotation }))
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
    setRotation(90)
  }

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate all pages in your PDF document to the correct orientation."
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Rotation Angle
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[90, 180, 270, 360].map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setRotation(angle)}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                      rotation === angle
                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <RotateCw 
                      className="h-8 w-8" 
                      style={{ transform: `rotate(${angle}deg)` }}
                    />
                    <span className="font-medium">{angle}°</span>
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
                onClick={handleRotate}
                className="btn-primary"
              >
                Rotate PDF
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <LoadingSpinner text="Rotating your PDF..." />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Rotated Successfully!</h3>
            <p className="text-gray-600">Your PDF has been rotated and is ready for download.</p>
          </div>
          
          <button
            onClick={handleDownload}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download Rotated PDF</span>
          </button>
        </div>
      )}
    </ToolLayout>
  )
}

export default RotatePDFPage