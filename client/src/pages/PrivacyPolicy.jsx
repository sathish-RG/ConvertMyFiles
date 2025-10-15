import React from 'react';
import SEO from '../components/common/SEO';

const PrivacyPolicy = () => {
  const seoData = {
    title: 'Privacy Policy - ConvertMyFiles',
    description: 'Privacy policy for ConvertMyFiles. Learn how we protect your data and respect your privacy.',
    keywords: 'privacy policy, data protection, file security, user privacy',
    canonical: '/privacy-policy'
  };

  return (
    <>
      <SEO {...seoData} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                  ConvertMyFiles is committed to protecting your privacy. We collect minimal information necessary to provide our services:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Files you upload for processing (temporarily stored during processing)</li>
                  <li>Basic usage analytics (page views, tool usage)</li>
                  <li>Technical information (IP address, browser type, device information)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Process your files according to your requests</li>
                  <li>Improve our services and user experience</li>
                  <li>Monitor and analyze usage patterns</li>
                  <li>Ensure security and prevent abuse</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. File Security and Storage</h2>
                <p className="text-gray-700 mb-4">
                  Your files are processed securely on our servers and are automatically deleted immediately after processing. 
                  We do not store, access, or share your files with third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Remember your preferences</li>
                  <li>Analyze site usage with Google Analytics</li>
                  <li>Serve relevant advertisements through Google AdSense</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
                <p className="text-gray-700 mb-4">
                  We use the following third-party services:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Google Analytics:</strong> For usage analytics and insights</li>
                  <li><strong>Google AdSense:</strong> For displaying advertisements</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                <p className="text-gray-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Access information we have about you</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of analytics tracking</li>
                  <li>Disable cookies in your browser</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at: 
                  <strong> privacy@convertmyfiles.com</strong>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
