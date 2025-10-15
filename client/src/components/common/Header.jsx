import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText, Menu, X, ChevronDown } from 'lucide-react'

const Header = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pdfDropdownOpen, setPdfDropdownOpen] = useState(false)
  const [imageDropdownOpen, setImageDropdownOpen] = useState(false)

  const pdfTools = [
    { name: 'PDF Compressor', path: '/pdf-compressor', description: 'Reduce file size' },
    { name: 'Split PDF', path: '/split-pdf', description: 'Extract pages' },
    { name: 'Rotate PDF', path: '/rotate-pdf', description: 'Fix orientation' },
    { name: 'PDF to Word', path: '/pdf-to-word', description: 'Convert to DOCX' },
    { name: 'Word to PDF', path: '/word-to-pdf', description: 'Convert DOCX to PDF' },
  ]

  const imageTools = [
    { name: 'Image Converter', path: '/image-converter', description: 'Change format' },
    { name: 'Image Compressor', path: '/image-compressor', description: 'Reduce size' },
  ]

  const isActivePath = (path) => {
    return location.pathname === path
  }

  const isActiveSection = (section) => {
    if (section === 'pdf') {
      return location.pathname.includes('pdf')
    }
    if (section === 'image') {
      return location.pathname.includes('image')
    }
    return false
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setPdfDropdownOpen(false)
    setImageDropdownOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMobileMenu}>
            <FileText className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              FreeTools
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Home */}
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActivePath('/')
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            
            {/* PDF Tools Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                  isActiveSection('pdf')
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
                onMouseEnter={() => setPdfDropdownOpen(true)}
                onMouseLeave={() => setPdfDropdownOpen(false)}
              >
                <span>PDF Tools</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {/* PDF Dropdown */}
              <div 
                className={`absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 transition-all duration-200 ${
                  pdfDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setPdfDropdownOpen(true)}
                onMouseLeave={() => setPdfDropdownOpen(false)}
              >
                {pdfTools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="font-medium text-gray-900 group-hover:text-primary-600">
                      {tool.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {tool.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Image Tools Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                  isActiveSection('image')
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
                onMouseEnter={() => setImageDropdownOpen(true)}
                onMouseLeave={() => setImageDropdownOpen(false)}
              >
                <span>Image Tools</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {/* Image Dropdown */}
              <div 
                className={`absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 transition-all duration-200 ${
                  imageDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setImageDropdownOpen(true)}
                onMouseLeave={() => setImageDropdownOpen(false)}
              >
                {imageTools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="font-medium text-gray-900 group-hover:text-primary-600">
                      {tool.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {tool.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {/* Home */}
              <Link
                to="/"
                className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActivePath('/')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              
              {/* PDF Tools Section */}
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  PDF Tools
                </div>
                <div className="space-y-1 ml-4">
                  {pdfTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className={`block py-2 text-sm transition-colors ${
                        isActivePath(tool.path)
                          ? 'text-primary-600 font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Image Tools Section */}
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Image Tools
                </div>
                <div className="space-y-1 ml-4">
                  {imageTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className={`block py-2 text-sm transition-colors ${
                        isActivePath(tool.path)
                          ? 'text-primary-600 font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header