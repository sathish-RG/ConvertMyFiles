import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, RefreshCw, Info, Shield, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { SEO_DATA } from '../../utils/constants'

const ToolLayout = ({ 
  title, 
  description, 
  children, 
  onReset, 
  resetAction,
  toolId,
  features = [],
  showBackButton = true,
  showResetButton = true,
  className = ""
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get SEO data for the current tool
  const seoData = toolId ? SEO_DATA[toolId] : null

  const handleReset = () => {
    if (resetAction) {
      dispatch(resetAction())
    }
    if (onReset) {
      onReset()
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const defaultFeatures = [
    { icon: Shield, text: "100% Secure & Private", color: "text-green-600" },
    { icon: Zap, text: "Fast Processing", color: "text-blue-600" },
    { icon: RefreshCw, text: "No Registration Required", color: "text-purple-600" }
  ]

  const displayFeatures = features.length > 0 ? features : defaultFeatures

  return (
    <>
      {/* SEO Meta Tags */}
      {seoData && (
        <Helmet>
          <title>{seoData.title}</title>
          <meta name="description" content={seoData.description} />
          <meta name="keywords" content={seoData.keywords} />
          
          {/* Open Graph */}
          <meta property="og:title" content={seoData.title} />
          <meta property="og:description" content={seoData.description} />
          <meta property="og:type" content="website" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoData.title} />
          <meta name="twitter:description" content={seoData.description} />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": title,
              "description": description,
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })}
          </script>
        </Helmet>
      )}

      <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 lg:py-12 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8 lg:mb-12">
            {/* Back Button */}
            {showBackButton && (
              <div className="flex justify-start mb-6">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Tools</span>
                </button>
              </div>
            )}

            {/* Title and Description */}
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                {title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                {description}
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {displayFeatures.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <IconComponent className={`h-5 w-5 ${feature.color}`} />
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Main Tool Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
            {children}
          </div>
          
          {/* Action Buttons */}
          {showResetButton && (
            <div className="text-center mb-8">
              <button
                onClick={handleReset}
                className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Start Over</span>
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Your Privacy is Protected</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  All files are processed securely on our servers and automatically deleted after processing. 
                  We don't store, share, or access your files. Your data remains completely private.
                </p>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Info className="h-5 w-5 text-gray-600" />
              <span>How it works</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Upload</h4>
                <p className="text-sm text-gray-600">Select or drag your file</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Process</h4>
                <p className="text-sm text-gray-600">We handle it instantly</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Download</h4>
                <p className="text-sm text-gray-600">Get your processed file</p>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">More Free Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/pdf-compressor" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="text-2xl mb-2">📄</div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">PDF Compressor</p>
              </Link>
              <Link to="/split-pdf" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="text-2xl mb-2">✂️</div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">Split PDF</p>
              </Link>
              <Link to="/image-converter" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="text-2xl mb-2">🖼️</div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">Image Converter</p>
              </Link>
              <Link to="/image-compressor" className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="text-2xl mb-2">📐</div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">Image Compressor</p>
              </Link>
            </div>
          </div>
        </div>
        
        {/* AdSense Placement */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 font-medium">Advertisement Space</p>
            <p className="text-gray-400 text-sm mt-1">(Google AdSense)</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ToolLayout