import { useEffect } from 'react';

export default function useAnalytics(user) {
  useEffect(() => {
    if (!user || !user.id) return;
    if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return;

    const controller = new AbortController();
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      signal: controller.signal,
      body: JSON.stringify({
        event: 'pageview',
        page: window.location.pathname,
        planType: user.planType || '',
      }),
    }).catch(() => { /* silent */ });

    return () => controller.abort();
  }, [user]);
}
