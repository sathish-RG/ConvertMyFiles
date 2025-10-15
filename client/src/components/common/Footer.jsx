import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Mail, Shield, Info } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const pdfTools = [
    { name: 'PDF Compressor', path: '/pdf-compressor' },
    { name: 'Split PDF', path: '/split-pdf' },
    { name: 'Rotate PDF', path: '/rotate-pdf' },
    { name: 'PDF to Word', path: '/pdf-to-word' },
  ]

  const imageTools = [
    { name: 'Image Converter', path: '/image-converter' },
    { name: 'Image Compressor', path: '/image-compressor' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">FreeTools</span>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Professional-grade PDF and image processing tools. 
              Secure, fast, and completely free to use. No registration required.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Shield className="h-4 w-4" />
              <span>100% Secure & Private</span>
            </div>
          </div>
          
          {/* PDF Tools */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">PDF Tools</h4>
            <ul className="space-y-2">
              {pdfTools.map((tool) => (
                <li key={tool.path}>
                  <Link 
                    to={tool.path} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block py-1"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Image Tools */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Image Tools</h4>
            <ul className="space-y-2">
              {imageTools.map((tool) => (
                <li key={tool.path}>
                  <Link 
                    to={tool.path} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block py-1"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support & Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <Info className="h-4 w-4" />
                  <span>How it works</span>
                </button>
              </li>
              <li>
                <Link 
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <Info className="h-4 w-4" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact Us</span>
                </button>
              </li>
            </ul>
            
            {/* Social proof */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500 mb-2">Trusted by users worldwide</p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-500 ml-2">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>© {currentYear} FreeTools. All rights reserved.</p>
            </div>
            
            <div className="text-sm text-gray-400 text-center md:text-right">
              <p className="mb-1">🔒 All files processed securely and deleted after use</p>
              <p>⚡ No registration • No tracking • Completely free</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* AdSense Placeholder */}
      <div className="border-t border-gray-800 bg-gray-850">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm">Advertisement Space (Google AdSense)</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer