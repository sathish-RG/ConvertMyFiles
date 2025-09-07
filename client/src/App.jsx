import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import PDFCompressorPage from './pages/PDFCompressorPage'
import SplitPDFPage from './pages/SplitPDFPage'
import RotatePDFPage from './pages/RotatePDFPage'
import PDFToWordPage from './pages/PDFToWordPage'
import ImageConverterPage from './pages/ImageConverterPage'
import ImageCompressorPage from './pages/ImageCompressorPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pdf-compressor" element={<PDFCompressorPage />} />
          <Route path="/split-pdf" element={<SplitPDFPage />} />
          <Route path="/rotate-pdf" element={<RotatePDFPage />} />
          <Route path="/pdf-to-word" element={<PDFToWordPage />} />
          <Route path="/image-converter" element={<ImageConverterPage />} />
          <Route path="/image-compressor" element={<ImageCompressorPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App