import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Free Tools - PDF & Image Processing',
  description = 'Free online tools for PDF and image processing. Compress, convert, split, and rotate files instantly with our secure web-based tools.',
  keywords = 'PDF tools, image converter, file compression, free online tools, PDF compressor, image compressor, PDF splitter, PDF to Word, Word to PDF',
  canonical = '',
  image = '/og-image.jpg',
  type = 'website',
  structuredData = null
}) => {
  const siteUrl = 'https://convertmyfiles.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ConvertMyFiles",
    "description": description,
    "url": siteUrl,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "PDF Compression",
      "Image Compression", 
      "PDF Splitting",
      "PDF Rotation",
      "PDF to Word Conversion",
      "Word to PDF Conversion",
      "Image Format Conversion"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="ConvertMyFiles" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ConvertMyFiles" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
