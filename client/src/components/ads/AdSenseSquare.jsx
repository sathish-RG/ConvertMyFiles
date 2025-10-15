import React from 'react';
import AdSenseAd from './AdSenseAd';

const AdSenseSquare = ({ className = '', style = {} }) => {
  return (
    <div className={`ad-square-container ${className}`} style={style}>
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {/* Placeholder for development */}
        <p className="text-gray-500 font-medium text-sm">Ad Space</p>
        <p className="text-gray-400 text-xs mt-1">(300x250)</p>
        
        {/* Uncomment when AdSense is approved */}
        {/* <AdSenseAd 
          adSlot="XXXXXXXXXX" 
          adFormat="rectangle"
          style={{ width: '300px', height: '250px' }}
        /> */}
      </div>
    </div>
  );
};

export default AdSenseSquare;
