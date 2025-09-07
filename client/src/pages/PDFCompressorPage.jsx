import React from 'react'
import ToolLayout from '../components/layout/ToolLayout'
import PDFCompressor from '../components/tools/PDFCompressor'
import { resetState } from '../store/slices/pdfSlice'

const PDFCompressorPage = () => {
  return (
    <ToolLayout
      title="PDF Compressor"
      description="Reduce your PDF file size without losing quality. Perfect for sharing and uploading documents."
      resetAction={resetState}
    >
      <PDFCompressor />
    </ToolLayout>
  )
}

export default PDFCompressorPage