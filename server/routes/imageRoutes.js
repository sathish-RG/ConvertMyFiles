const express = require('express');
const upload = require('../middleware/upload');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.post('/convert', upload.single('image'), imageController.convertImage);
router.post('/compress', upload.single('image'), imageController.compressImage);

module.exports = router;