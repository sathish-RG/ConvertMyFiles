// Tool categories
export const TOOL_CATEGORIES = {
  PDF: 'PDF Tools',
  IMAGE: 'Image Tools'
}

// Main tools configuration
export const TOOLS = [
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    description: 'Reduce PDF file size without losing quality',
    category: TOOL_CATEGORIES.PDF,
    path: '/pdf-compressor',
    icon: '📄',
    features: ['Fast compression', 'Quality preserved', 'No watermarks'],
    acceptedFormats: ['PDF']
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages from PDF documents',
    category: TOOL_CATEGORIES.PDF,
    path: '/split-pdf',
    icon: '✂️',
    features: ['Page range selection', 'Multiple outputs', 'Batch processing'],
    acceptedFormats: ['PDF']
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to the correct orientation',
    category: TOOL_CATEGORIES.PDF,
    path: '/rotate-pdf',
    icon: '🔄',
    features: ['90°, 180°, 270° rotation', 'All pages at once', 'Preview available'],
    acceptedFormats: ['PDF']
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF documents to Word format',
    category: TOOL_CATEGORIES.PDF,
    path: '/pdf-to-word',
    icon: '📝',
    features: ['Editable DOCX output', 'Layout preserved', 'Text extraction'],
    acceptedFormats: ['PDF']
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert images between different formats',
    category: TOOL_CATEGORIES.IMAGE,
    path: '/image-converter',
    icon: '🖼️',
    features: ['Multiple formats', 'Batch conversion', 'Quality control'],
    acceptedFormats: ['JPG', 'PNG', 'WebP', 'GIF']
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images to reduce file size',
    category: TOOL_CATEGORIES.IMAGE,
    path: '/image-compressor',
    icon: '📐',
    features: ['Quality slider', 'Size reduction', 'Multiple formats'],
    acceptedFormats: ['JPG', 'PNG', 'WebP']
  }
]

// Supported file formats
export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf']
export const SUPPORTED_PDF_FORMATS = ['pdf']

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  PDF: 50 * 1024 * 1024, // 50MB
  IMAGE: 50 * 1024 * 1024, // 50MB
  DEFAULT: 50 * 1024 * 1024 // 50MB
}

// MIME type mappings
export const MIME_TYPES = {
  // PDF
  'application/pdf': 'pdf',
  
  // Images
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/tiff': 'tiff',
  'image/svg+xml': 'svg'
}

// File validation rules
export const VALIDATION_RULES = {
  PDF: {
    maxSize: FILE_SIZE_LIMITS.PDF,
    allowedTypes: ['application/pdf'],
    extensions: ['.pdf']
  },
  IMAGE: {
    maxSize: FILE_SIZE_LIMITS.IMAGE,
    allowedTypes: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ],
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  }
}

// Quality settings for compression
export const COMPRESSION_QUALITY = {
  LOW: 30,
  MEDIUM: 50,
  GOOD: 70,
  HIGH: 80,
  MAXIMUM: 90
}

// Rotation angles
export const ROTATION_ANGLES = [90, 180, 270, 360]

// API endpoints
export const API_ENDPOINTS = {
  PDF: {
    COMPRESS: '/pdf/compress',
    SPLIT: '/pdf/split',
    ROTATE: '/pdf/rotate',
    TO_WORD: '/pdf/pdf-to-word'
  },
  IMAGE: {
    CONVERT: '/image/convert',
    COMPRESS: '/image/compress'
  },
  HEALTH: '/health'
}

// Error messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type selected',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  UPLOAD_FAILED: 'File upload failed. Please try again',
  PROCESSING_FAILED: 'File processing failed. Please try again',
  NO_FILE_SELECTED: 'Please select a file to process'
}

// Success messages
export const SUCCESS_MESSAGES = {
  PDF_COMPRESSED: 'PDF compressed successfully!',
  PDF_SPLIT: 'PDF split successfully!',
  PDF_ROTATED: 'PDF rotated successfully!',
  PDF_CONVERTED: 'PDF converted to Word successfully!',
  IMAGE_CONVERTED: 'Image converted successfully!',
  IMAGE_COMPRESSED: 'Image compressed successfully!'
}

// Processing status
export const PROCESSING_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error'
}

// Feature flags (for future enhancements)
export const FEATURES = {
  BATCH_PROCESSING: false,
  CLOUD_STORAGE: false,
  USER_ACCOUNTS: false,
  PREMIUM_TOOLS: false,
  API_ACCESS: false
}

// SEO and meta data
export const SEO_DATA = {
  'pdf-compressor': {
    title: 'Free PDF Compressor - Reduce PDF File Size Online',
    description: 'Compress PDF files online for free. Reduce file size without losing quality. Fast, secure, and easy to use.',
    keywords: 'PDF compressor, reduce PDF size, compress PDF online, PDF optimization'
  },
  'split-pdf': {
    title: 'Split PDF Online - Extract Pages from PDF Free',
    description: 'Split PDF files online for free. Extract specific pages or page ranges from PDF documents quickly and securely.',
    keywords: 'split PDF, extract PDF pages, PDF splitter, divide PDF'
  },
  'rotate-pdf': {
    title: 'Rotate PDF Pages Online - Fix PDF Orientation Free',
    description: 'Rotate PDF pages online for free. Fix document orientation with 90, 180, or 270-degree rotation.',
    keywords: 'rotate PDF, fix PDF orientation, PDF rotation tool'
  },
  'pdf-to-word': {
    title: 'PDF to Word Converter - Convert PDF to DOCX Online Free',
    description: 'Convert PDF to Word documents online for free. Maintain formatting and create editable DOCX files.',
    keywords: 'PDF to Word, PDF to DOCX converter, convert PDF online'
  },
  'image-converter': {
    title: 'Free Image Converter - Convert JPG, PNG, WebP Online',
    description: 'Convert images between formats online for free. Support for JPG, PNG, WebP, GIF, and PDF conversion.',
    keywords: 'image converter, convert JPG to PNG, image format converter'
  },
  'image-compressor': {
    title: 'Free Image Compressor - Reduce Image File Size Online',
    description: 'Compress images online for free. Reduce file size while maintaining quality. Support for JPG, PNG, WebP.',
    keywords: 'image compressor, reduce image size, optimize images online'
  }
}

// Social sharing data
export const SOCIAL_SHARE = {
  twitter: {
    handle: '@FreeToolsApp',
    hashtags: ['PDFTools', 'ImageTools', 'FreeTools']
  },
  facebook: {
    appId: 'your-facebook-app-id'
  }
}

// Analytics events (for tracking)
export const ANALYTICS_EVENTS = {
  FILE_UPLOAD: 'file_upload',
  TOOL_USED: 'tool_used',
  FILE_DOWNLOAD: 'file_download',
  ERROR_OCCURRED: 'error_occurred',
  PAGE_VIEW: 'page_view'
}

// Default export for commonly used constants
export default {
  TOOLS,
  TOOL_CATEGORIES,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_PDF_FORMATS,
  FILE_SIZE_LIMITS,
  COMPRESSION_QUALITY,
  ROTATION_ANGLES
}