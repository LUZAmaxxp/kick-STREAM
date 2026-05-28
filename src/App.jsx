import { useEffect, useState, lazy, Suspense } from 'react';
import useAnalytics from './hooks/useAnalytics';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Hero from './components/Hero';
import ChatWidget from './components/ChatWidget';
import AuthPage from './pages/AuthPage';
const TrustBar        = lazy(() => import('./components/TrustBar'));
const ProductReveal   = lazy(() => import('./components/ProductReveal'));
const HowItWorks      = lazy(() => import('./components/HowItWorks'));
const Stats           = lazy(() => import('./components/Stats'));
const Pricing         = lazy(() => import('./components/Pricing'));
const Testimonials    = lazy(() => import('./components/Testimonials'));
const LiveMatchTicker = lazy(() => import('./components/LiveMatchTicker'));
const FAQ             = lazy(() => import('./components/FAQ'));
const FinalCTA        = lazy(() => import('./components/FinalCTA'));
const Footer          = lazy(() => import('./components/Footer'));
const AdminApp        = lazy(() => import('./admin/index.jsx'));

export default function App() {
  const [scrollPct, setScrollPct] = useState(0);
  const [user, setUser] = useState(null);

  // Auth handler: expects userData to include authToken
  const handleAuth = (userData) => {
    setUser(userData);
    // No localStorage, rely on cookies
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    // Optionally, call backend to clear cookie
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
  };

  // Check for session cookie on mount to persist login
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/session`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollPct(Math.min(pct, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track analytics for user visits
  useAnalytics(user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={<AuthPage onAuth={handleAuth} />}
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="/*"
          element={
            <div className="overflow-x-hidden" style={{ backgroundColor: '#F5F3EE', color: '#1A1A1A' }}>
              {/* Scroll progress bar */}
              <div
                className="fixed top-0 left-0 z-[60] h-[2px] transition-none"
                style={{ width: `${scrollPct}%`, backgroundColor: '#E8714F' }}
              />

              <Nav user={user} logout={logout} />
              <Hero />
              {user && <ChatWidget user={user} />}
              <Suspense fallback={null}>
                <TrustBar />
                <ProductReveal />
                <HowItWorks />
                <Stats />
                <Pricing />
                <Testimonials />
                <LiveMatchTicker />
                <FAQ />
                <FinalCTA />
                <Footer />
              </Suspense>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
