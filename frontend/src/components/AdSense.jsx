import React, { useEffect, useRef } from 'react';

/**
 * AdSense component for displaying Google AdSense ads
 * @param {string} slotId - Optional AdSense slot ID
 * @param {string} format - Ad format (auto, horizontal, vertical, rectangle)
 * @param {string} className - Additional CSS classes
 */
const AdSense = ({ slotId, format = 'auto', className = '' }) => {
  const adRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Only initialize once per component instance
    if (initialized.current) return;
    
    const initializeAd = () => {
      try {
        if (typeof window === 'undefined' || !window.adsbygoogle) {
          return false;
        }

        // Find the ins element for this specific ad unit
        const adElement = adRef.current?.querySelector('.adsbygoogle');
        
        // Check if ad is already initialized (has data-adsbygoogle-status attribute)
        if (adElement && !adElement.hasAttribute('data-adsbygoogle-status')) {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          initialized.current = true;
          return true;
        }
        return false;
      } catch (error) {
        // Silently handle AdSense errors (common during development)
        if (process.env.NODE_ENV === 'development') {
          console.log('AdSense initialization error (normal in development):', error);
        }
        return false;
      }
    };

    // Try to initialize immediately
    if (initializeAd()) {
      return;
    }

    // If script not loaded yet, wait for it
    const checkAdSense = setInterval(() => {
      if (initializeAd()) {
        clearInterval(checkAdSense);
      }
    }, 100);

    // Cleanup interval after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkAdSense);
    }, 10000);

    return () => {
      clearInterval(checkAdSense);
      clearTimeout(timeout);
    };
  }, []);

  // AdSense ad unit styles based on format
  const getAdStyles = () => {
    switch (format) {
      case 'horizontal':
        return { display: 'block', width: '100%', minHeight: '100px' };
      case 'vertical':
        return { display: 'block', width: '160px', minHeight: '600px' };
      case 'rectangle':
        return { display: 'block', width: '300px', minHeight: '250px' };
      default:
        return { display: 'block', width: '100%', minHeight: '100px' };
    }
  };

  return (
    <div ref={adRef} className={`adsense-container ${className}`} style={getAdStyles()}>
      <ins
        className="adsbygoogle"
        style={getAdStyles()}
        data-ad-client="ca-pub-1780366032174979"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;
