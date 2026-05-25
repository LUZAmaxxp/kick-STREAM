import React, { useEffect } from 'react';

const AnalyticsTracker = () => {
  useEffect(() => {
    // Track page views, clicks, and section visits
    const handleClick = (e) => {
      const target = e.target.closest('[data-analytics]');
      if (target) {
        const event = {
          type: 'click',
          label: target.getAttribute('data-analytics'),
          timestamp: Date.now(),
        };
        let events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push(event);
        localStorage.setItem('analytics_events', JSON.stringify(events));
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  return null;
};

export default AnalyticsTracker;
