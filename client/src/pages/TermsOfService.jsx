import React from 'react';
import SEO from '../components/common/SEO';

const TermsOfService = () => {
  const seoData = {
    title: 'Terms of Service - ConvertMyFiles',
    description: 'Terms of service for ConvertMyFiles. Read our terms and conditions for using our file processing tools.',
    keywords: 'terms of service, terms and conditions, user agreement, legal terms',
    canonical: '/terms-of-service'
  };

  return (
    <>
      <SEO {...seoData} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using ConvertMyFiles, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                <p className="text-gray-700 mb-4">
                  Permission is granted to temporarily use ConvertMyFiles for personal and commercial purposes. This license shall automatically terminate if you violate any of these restrictions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Acceptable Use</h2>
                <p className="text-gray-700 mb-4">You may not use our service to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Upload illegal, harmful, or copyrighted content</li>
                  <li>Attempt to overwhelm our servers with excessive requests</li>
                  <li>Reverse engineer or attempt to extract our source code</li>
                  <li>Use automated tools to abuse our services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibent text-gray-900 mb-4">4. File Processing</h2>
                <p className="text-gray-700 mb-4">
                  We provide file processing services "as is" without warranties. While we strive for accuracy and quality, 
                  we cannot guarantee perfect results for all file types and conditions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Security</h2>
                <p className="text-gray-700 mb-4">
                  Your files are processed securely and deleted immediately after processing. 
                  Please refer to our Privacy Policy for detailed information about data handling.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  ConvertMyFiles shall not be liable for any damages arising from the use or inability to use our services, 
                  including but not limited to data loss, business interruption, or other commercial damages.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Service Availability</h2>
                <p className="text-gray-700 mb-4">
                  We strive to maintain high availability but do not guarantee uninterrupted service. 
                  We reserve the right to modify or discontinue services with or without notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
                <p className="text-gray-700">
                  For questions about these Terms of Service, please contact us at: 
                  <strong> legal@convertmyfiles.com</strong>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
