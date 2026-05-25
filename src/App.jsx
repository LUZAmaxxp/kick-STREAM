import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import AuthPage from './pages/AuthPage';
import Hero from './components/Hero';
import ContactAdmin from './components/ContactAdmin';
import ChatWidget from './components/ChatWidget';
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
  const [user, setUser] = useState(null); // User state for authentication
  // Remove showAuth, use page instead



  // Auth handler: expects userData to include authToken
  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.authToken) {
      localStorage.setItem('authToken', userData.authToken);
    }
  };


  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };


  // Check for stored user and authToken on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      if (authToken) userObj.authToken = authToken;
      setUser(userObj);
    }
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

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="/auth"
          element={<AuthPage onAuth={handleAuth} />}
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
                <Suspense fallback={null}>
                  {user && <ChatWidget user={user} />}
                <TrustBar />
                <ProductReveal />
                <HowItWorks />
                <Stats />
                <Pricing />
                <Testimonials />
                <LiveMatchTicker />
                <FAQ />
                <ContactAdmin /> 
                <Footer />
              </Suspense>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
