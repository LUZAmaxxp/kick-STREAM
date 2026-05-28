import React, { useEffect } from 'react';

const AnalyticsTracker = () => {
  useEffect(() => {
    // Track page views, clicks, and section visits
    const handleClick = (e) => {
      const target = e.target.closest('[data-analytics]');
      if (target) {
        // TODO: Send analytics event to backend or store in cookie if needed
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  return null;
};

export default AnalyticsTracker;
