import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ToolLayout from '../components/layout/ToolLayout'
import SEO from '../components/common/SEO'
import { seoConfig } from '../utils/seoConfig'
import FileUpload from '../components/common/FileUpload'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { convertPDFToWord, resetState } from '../store/slices/pdfSlice'
import { Download } from 'lucide-react'

const PDFToWordPage = () => {
  const dispatch = useDispatch()
  const { loading, error, success, downloadUrl, filename } = useSelector(state => state.pdf)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleConvert = () => {
    if (selectedFile) {
      dispatch(convertPDFToWord(selectedFile))
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
  }

  return (
    <>
      <SEO {...seoConfig.pdfToWord} />
      <ToolLayout
        title="PDF to Word Converter"
        description="Convert your PDF documents to editable Word format (.docx). Maintain formatting and layout."
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Note:</strong> PDF to Word conversion is a complex process. Some formatting 
                may change during conversion, especially for documents with complex layouts.
              </p>
            </div>

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
                  Convert to Word
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <LoadingSpinner text="Converting PDF to Word..." />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Converted Successfully!</h3>
              <p className="text-gray-600">Your PDF has been converted to Word format and is ready for download.</p>
            </div>
            
            <button
              onClick={handleDownload}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Download Word Document</span>
            </button>
          </div>
        )}
      </ToolLayout>
    </>
  )
}

export default PDFToWordPage