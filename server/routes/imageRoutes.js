const express = require('express');
const upload = require('../middleware/upload');
const imageController = require('../controllers/imageController');

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

router.post('/convert', upload.single('image'), handleMulterError, imageController.convertImage);
router.post('/convert-batch', upload.array('images', 20), handleMulterError, imageController.convertBatchImages);
router.post('/compress', upload.single('image'), handleMulterError, imageController.compressImage);
router.post('/compress-batch', upload.array('images', 20), handleMulterError, imageController.compressBatchImages);

module.exports = router;