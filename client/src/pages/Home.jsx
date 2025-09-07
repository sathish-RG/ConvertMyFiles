import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  FileText, 
  Image, 
  Shield, 
  Zap, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Globe,
  Lock,
  Download,
  Smartphone
} from 'lucide-react'
import { TOOLS, TOOL_CATEGORIES } from '../utils/constants'

const Home = () => {
  const [stats] = useState({
    users: '50,000+',
    filesProcessed: '500,000+',
    rating: '4.9'
  })

  // Group tools by category
  const toolsByCategory = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {})

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Free Online PDF & Image Tools - FreeTools</title>
        <meta name="description" content="Professional PDF and image processing tools online. Compress, convert, split, rotate files for free. No registration required." />
        <meta name="keywords" content="PDF tools, image converter, file compressor, free online tools, PDF compressor, image optimizer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Online PDF & Image Tools - FreeTools" />
        <meta property="og:description" content="Professional PDF and image processing tools online. Free, secure, and easy to use." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yoursite.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Online PDF & Image Tools" />
        <meta name="twitter:description" content="Professional PDF and image processing tools online. Free, secure, and easy to use." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "FreeTools",
            "description": "Professional PDF and image processing tools online",
            "url": "https://yoursite.com",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "1250"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center">
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Professional{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  File Processing
                </span>{' '}
                Tools
              </h1>
              
              <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8 leading-relaxed">
                Transform your PDFs and images with professional-grade tools. 
                Completely free, secure, and no registration required.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-10">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stats.users}</div>
                  <div className="text-primary-200 text-sm">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stats.filesProcessed}</div>
                  <div className="text-primary-200 text-sm">Files Processed</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-2xl md:text-3xl font-bold text-white">{stats.rating}</span>
                  </div>
                  <div className="text-primary-200 text-sm">User Rating</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <button
                  onClick={() => scrollToSection('tools')}
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <FileText className="h-5 w-5" />
                  <span>Explore Tools</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Shield className="h-5 w-5" />
                  <span>Why Choose Us</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-primary-200 text-sm">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>No Registration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Tool
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional-grade file processing tools at your fingertips
              </p>
            </div>

            {Object.entries(toolsByCategory).map(([category, tools]) => (
              <div key={category} className="mb-16">
                <div className="flex items-center justify-center mb-10">
                  <div className="flex items-center space-x-3">
                    {category === TOOL_CATEGORIES.PDF ? (
                      <FileText className="h-8 w-8 text-primary-600" />
                    ) : (
                      <Image className="h-8 w-8 text-primary-600" />
                    )}
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{category}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-primary-200 transform hover:-translate-y-1"
                    >
                      {/* Tool Icon */}
                      <div className="text-5xl mb-6 text-center">
                        {tool.icon}
                      </div>
                      
                      {/* Tool Info */}
                      <div className="text-center">
                        <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                          {tool.name}
                        </h4>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {tool.description}
                        </p>
                        
                        {/* Features */}
                        {tool.features && (
                          <div className="space-y-2 mb-6">
                            {tool.features.slice(0, 2).map((feature, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-500">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* CTA */}
                        <div className="inline-flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                          <span>Try it now</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose FreeTools?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Built with security, speed, and simplicity in mind
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* Security */}
              <div className="text-center group">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">100% Secure & Private</h3>
                <p className="text-gray-600 leading-relaxed">
                  All files are processed securely on our servers and automatically deleted after processing. 
                  Your privacy is our top priority.
                </p>
              </div>

              {/* Speed */}
              <div className="text-center group">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <Zap className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">
                  Optimized algorithms ensure quick processing of your files. 
                  Most operations complete in seconds, not minutes.
                </p>
              </div>

              {/* Free */}
              <div className="text-center group">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Completely Free</h3>
                <p className="text-gray-600 leading-relaxed">
                  No hidden charges, no subscriptions, no registration required. 
                  All tools are free forever for everyone.
                </p>
              </div>

              {/* Quality */}
              <div className="text-center group">
                <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-200 transition-colors">
                  <Star className="h-10 w-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Professional Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  Enterprise-grade tools that maintain file quality and formatting. 
                  Perfect for business and personal use.
                </p>
              </div>

              {/* Mobile Friendly */}
              <div className="text-center group">
                <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
                  <Smartphone className="h-10 w-10 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Works Everywhere</h3>
                <p className="text-gray-600 leading-relaxed">
                  Responsive design works perfectly on desktop, tablet, and mobile. 
                  Process files anywhere, anytime.
                </p>
              </div>

              {/* No Software */}
              <div className="text-center group">
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                  <Download className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">No Software Needed</h3>
                <p className="text-gray-600 leading-relaxed">
                  Everything works in your browser. No downloads, no installations, 
                  no software updates required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Process Your Files?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users who trust FreeTools for their file processing needs.
            </p>
            <button
              onClick={() => scrollToSection('tools')}
              className="bg-white text-primary-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
            >
              <span>Start Processing Files</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* AdSense Placement */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500 font-medium">Advertisement Space</p>
              <p className="text-gray-400 text-sm mt-1">(Google AdSense)</p>
            </div>
          </div>
        </section>

        {/* FAQ Section (Optional) */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Are my files safe and secure?
                </h3>
                <p className="text-gray-600">
                  Absolutely! All files are processed securely on our servers and automatically 
                  deleted immediately after processing. We never store, access, or share your files.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a file size limit?
                </h3>
                <p className="text-gray-600">
                  Yes, we support files up to 50MB to ensure fast processing times. 
                  This covers most typical use cases for PDF and image files.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do I need to create an account?
                </h3>
                <p className="text-gray-600">
                  No registration required! All tools are available instantly without 
                  creating an account or providing any personal information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home