import { useEffect } from 'react';

const AdSenseScript = ({ clientId = 'ca-pub-XXXXXXXXXXXXXXXX' }) => {
  useEffect(() => {
    // Only load AdSense script if it hasn't been loaded already
    if (!window.adsbygoogle && clientId !== 'ca-pub-XXXXXXXXXXXXXXXX') {
      try {
        // Create and append AdSense script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        script.crossOrigin = 'anonymous';
        
        // Add error handling
        script.onerror = () => {
          console.warn('AdSense script failed to load');
        };
        
        document.head.appendChild(script);
        
        // Initialize adsbygoogle array
        window.adsbygoogle = window.adsbygoogle || [];
        
        // Cleanup function
        return () => {
          // Remove script if component unmounts
          const existingScript = document.querySelector(`script[src*="${clientId}"]`);
          if (existingScript) {
            document.head.removeChild(existingScript);
          }
        };
      } catch (error) {
        console.error('Error loading AdSense script:', error);
      }
    }
  }, [clientId]);

  // This component doesn't render anything
  return null;
};

export default AdSenseScript;
