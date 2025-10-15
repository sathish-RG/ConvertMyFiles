const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const mammoth = require('mammoth');

const app = express();
const PORT = 5000;

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Word files are allowed.'), false);
    }
  }
});

// Word to PDF endpoint
app.post('/api/pdf/word-to-pdf', upload.single('word'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No Word file uploaded'
      });
    }

    const inputPath = req.file.path;

    // Extract content from Word document
    const result = await mammoth.extractRawText({ path: inputPath });
    const text = result.value;

    if (!text || text.trim().length === 0) {
      await fs.remove(inputPath);
      return res.status(400).json({
        success: false,
        message: 'No text content found in the Word document'
      });
    }

    // Return extracted text
    const responseData = {
      success: true,
      message: 'Word document processed successfully',
      extractedText: text.substring(0, 1000), // First 1000 characters
      fullTextLength: text.length,
      filename: req.file.originalname,
      note: 'PDF generation requires additional libraries. This extracts text content only.'
    };

    // Clean up input file
    await fs.remove(inputPath);

    res.status(200).json(responseData);

  } catch (error) {
    console.error('Word to PDF conversion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to convert Word to PDF'
    });

    // Clean up input file on error
    if (req.file && req.file.path) {
      await fs.remove(req.file.path);
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Minimal server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Word to PDF API: http://localhost:${PORT}/api/pdf/word-to-pdf`);
}).on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
});
