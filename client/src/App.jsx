import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { initGA } from './utils/analytics'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import PDFCompressorPage from './pages/PDFCompressorPage'
import SplitPDFPage from './pages/SplitPDFPage'
import RotatePDFPage from './pages/RotatePDFPage'
import PDFToWordPage from './pages/PDFToWordPage'
import WordToPDFPage from './pages/WordToPDFPage'
import ImageConverterPage from './pages/ImageConverterPage'
import ImageCompressorPage from './pages/ImageCompressorPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

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
          <Route path="/word-to-pdf" element={<WordToPDFPage />} />
          <Route path="/image-converter" element={<ImageConverterPage />} />
          <Route path="/image-compressor" element={<ImageCompressorPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App