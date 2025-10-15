import React from 'react';
import AdSenseAd from './AdSenseAd';

const AdSenseBanner = ({ className = '', style = {} }) => {
  return (
    <div className={`ad-banner-container py-8 ${className}`} style={style}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {/* Placeholder for development */}
          <p className="text-gray-500 font-medium">Advertisement Space</p>
          <p className="text-gray-400 text-sm mt-1">(Google AdSense Banner)</p>
          
          {/* Uncomment when AdSense is approved */}
          {/* <AdSenseAd 
            adSlot="XXXXXXXXXX" 
            adFormat="rectangle"
            style={{ width: '728px', height: '90px' }}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default AdSenseBanner;
