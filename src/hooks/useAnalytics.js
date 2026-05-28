import { useEffect } from 'react';

// Usage: useAnalytics(user)
// user: { email, username, id, ... }
export default function useAnalytics(user) {
  useEffect(() => {
    if (!user || !user.email) return;
    // Track page view on mount
    fetch('/api/admin/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: user.email,
        name: user.username || user.email,
        userId: user.id,
        event: 'pageview',
        page: window.location.pathname,
        planType: user.planType || '',
        country: '', // Optionally set from geoip
        ip: '', // Optionally set from server
      })
    });
  }, [user]);
}
