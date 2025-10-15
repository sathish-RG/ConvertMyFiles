const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('File filter check:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  // Accept PDF, image, and Word files
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];

  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  // Check if the MIME type is allowed or if it's a Word file based on extension
  const isWordFile = fileExtension === '.docx' || fileExtension === '.doc';
  
  if (!allowedTypes.includes(file.mimetype) && !isWordFile) {
    console.log('Rejected: Invalid MIME type:', file.mimetype);
    return cb(new Error('Invalid file type. Only PDF, image, and Word files are allowed.'), false);
  }
  
  // Special handling for Word files that might have incorrect MIME types
  if (isWordFile) {
    console.log('Word file detected by extension, allowing regardless of MIME type');
    console.log('File accepted:', file.originalname);
    return cb(null, true);
  }

  // Additional validation for Word files
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    if (fileExtension !== '.docx') {
      console.log('Rejected: DOCX MIME type but wrong extension:', fileExtension);
      return cb(new Error('File extension does not match DOCX format.'), false);
    }
  } else if (file.mimetype === 'application/msword') {
    if (fileExtension !== '.doc') {
      console.log('Rejected: DOC MIME type but wrong extension:', fileExtension);
      return cb(new Error('File extension does not match DOC format.'), false);
    }
  }

  console.log('File accepted:', file.originalname);
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

module.exports = upload;