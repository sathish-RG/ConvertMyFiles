const express = require('express');
const upload = require('../middleware/upload');
const pdfController = require('../controllers/pdfController');

const router = express.Router();

router.post('/compress', upload.single('pdf'), pdfController.compressPDF);
router.post('/split', upload.single('pdf'), pdfController.splitPDF);
router.post('/rotate', upload.single('pdf'), pdfController.rotatePDF);
router.post('/pdf-to-word', upload.single('pdf'), pdfController.pdfToWord);

module.exports = router;