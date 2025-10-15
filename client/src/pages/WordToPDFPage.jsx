import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ToolLayout from '../components/layout/ToolLayout'
import SEO from '../components/common/SEO'
import { seoConfig } from '../utils/seoConfig'
import FileUpload from '../components/common/FileUpload'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { wordToPDF, resetState } from '../store/slices/wordToPDFSlice'
import { Download, FileText, ArrowRight } from 'lucide-react'

const WordToPDFPage = () => {
  const dispatch = useDispatch()
  const { loading, error, success, downloadUrl, filename } = useSelector(state => state.wordToPDF)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelect = (file) => {
    console.log('File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
    
    // Basic validation
    if (file.size < 1000) {
      console.warn('Warning: File size is very small:', file.size, 'bytes');
    }
    
    if (file.size === 0) {
      alert('The selected file appears to be empty. Please select a valid Word document.');
      return;
    }
    
    setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleConvert = () => {
    if (selectedFile) {
      dispatch(wordToPDF(selectedFile))
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
    dispatch(resetState())
  }

  return (
    <>
      <SEO {...seoConfig.wordToPdf} />
      <ToolLayout
      title="Word to PDF Converter"
      description="Convert your Word documents (.doc, .docx) to PDF format easily and quickly."
      onReset={handleReset}
      resetAction={resetState}
    >
      {!success ? (
        <div className="space-y-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            accept={{
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'application/msword': ['.doc']
            }}
            selectedFile={selectedFile}
            onRemoveFile={handleRemoveFile}
            disabled={loading}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {selectedFile && !loading && (
            <div className="text-center">
              <button
                onClick={handleConvert}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <FileText className="h-5 w-5" />
                <span>Convert to PDF</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <LoadingSpinner text="Converting your Word document to PDF..." />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Word Document Converted Successfully!</h3>
              <p className="text-gray-600">
                Your Word document has been converted to PDF format.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download PDF</span>
              </button>

              <p className="text-sm text-gray-500">
                Your converted PDF is ready for download.
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
    </>
  )
}

export default WordToPDFPage
