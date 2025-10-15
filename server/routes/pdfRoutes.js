const express = require('express');
const upload = require('../middleware/upload');
const pdfController = require('../controllers/pdfController');

const router = express.Router();

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('Multer error:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  next();
};

// Debug middleware
const debugRequest = (req, res, next) => {
  console.log(`${req.method} ${req.path} - Content-Type: ${req.headers['content-type']}`);
  next();
};

router.post('/compress', upload.single('pdf'), handleMulterError, pdfController.compressPDF);
router.post('/compress-advanced', upload.single('pdf'), handleMulterError, pdfController.compressAdvancedPDF);
router.post('/compress-batch', upload.array('pdfs', 20), handleMulterError, pdfController.compressBatchPDFs);
router.post('/split', upload.single('pdf'), handleMulterError, pdfController.splitPDF);
router.post('/rotate', upload.single('pdf'), handleMulterError, pdfController.rotatePDF);
router.post('/pdf-to-word', upload.single('pdf'), handleMulterError, pdfController.pdfToWord);
router.post('/word-to-pdf', debugRequest, upload.single('word'), handleMulterError, pdfController.wordToPDF);

module.exports = router;