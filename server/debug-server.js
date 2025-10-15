const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

// Write startup log
fs.writeFileSync('server.log', `Starting server at ${new Date().toISOString()}\n`);

try {
  const mammoth = require('mammoth');
  fs.appendFileSync('server.log', 'Mammoth loaded successfully\n');
} catch (error) {
  fs.appendFileSync('server.log', `Error loading mammoth: ${error.message}\n`);
  process.exit(1);
}

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
    fs.appendFileSync('server.log', `Error in /api/pdf/word-to-pdf: ${error.message}\n`);
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
  fs.appendFileSync('server.log', `Health check requested at ${new Date().toISOString()}\n`);
  res.status(200).json({ status: 'OK', message: 'Minimal server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  fs.appendFileSync('server.log', `Unhandled error: ${err.message}\n`);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  fs.appendFileSync('server.log', `Server started successfully on port ${PORT}\n`);
}).on('error', (err) => {
  console.error('❌ Server error:', err);
  fs.appendFileSync('server.log', `Server failed to start: ${err.message}\n`);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  server.close(() => {
    fs.appendFileSync('server.log', 'Server shut down gracefully\n');
    process.exit(0);
  });
});
