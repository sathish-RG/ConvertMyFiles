const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'https://localhost:3000',
      'https://localhost:5173',
      // Add your production domains here
      'https://your-production-domain.com',
      'https://www.your-production-domain.com',
      // Add your Netlify domain when deployed
      'https://your-netlify-app.netlify.app',
      // Add any other deployment domains
    ];

    // Allow any localhost development servers
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    
    if (allowedOrigins.includes(origin) || isLocalhost || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: [
    'Content-Disposition', // For file downloads
  ],
  maxAge: 86400, // 24 hours - how long the browser can cache preflight responses
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Create CORS middleware
const corsMiddleware = cors(corsOptions);

// Enhanced CORS middleware with additional security
const enhancedCorsMiddleware = (req, res, next) => {
  // Apply basic CORS
  corsMiddleware(req, res, (err) => {
    if (err) {
      console.error('CORS Error:', err.message);
      return res.status(403).json({
        success: false,
        message: 'CORS policy violation',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Access denied'
      });
    }

    // Additional security headers
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Content Security Policy for file uploads
    res.header(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'"
    );

    next();
  });
};

// Pre-flight OPTIONS handler
const handlePreflightRequest = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  next();
};

// Development CORS (more permissive)
const developmentCors = cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*'],
  exposedHeaders: ['Content-Disposition']
});

// Production CORS (more restrictive)
const productionCors = cors(corsOptions);

// Export appropriate middleware based on environment
const getCorsMiddleware = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Using development CORS (permissive)');
    return developmentCors;
  } else {
    console.log('🔒 Using production CORS (restrictive)');
    return enhancedCorsMiddleware;
  }
};

module.exports = {
  corsMiddleware,
  enhancedCorsMiddleware,
  handlePreflightRequest,
  developmentCors,
  productionCors,
  getCorsMiddleware,
  corsOptions
};