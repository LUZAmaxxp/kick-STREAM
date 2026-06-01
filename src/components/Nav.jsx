
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing',      href: '#pricing' },
  { label: 'Sign In',      href: '/auth' },
];


export default function Nav({ user, logout }) {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-50"
          style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(245, 243, 238, 0.9)', borderBottom: '2px solid #1A1A1A' }}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Wordmark */}
            <a href="#" className="font-display text-2xl tracking-widest text-black">
              KICKSTREAM
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-xs font-ui font-semibold uppercase tracking-[0.15em] text-black/60 hover:text-black transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-xs font-ui font-semibold uppercase tracking-[0.15em] text-black/60 hover:text-black transition-colors"
              >
                Pricing
              </a>
              {!user ? (
                <Link
                  to="/auth"
                  className="text-xs font-ui font-semibold uppercase tracking-[0.15em] text-black/60 hover:text-black transition-colors"
                >
                  Sign In
                </Link>
              ) : (
                <>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="text-xs font-ui font-semibold uppercase tracking-[0.15em] text-[#E8714F] hover:text-black transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <span className="text-xs font-ui font-semibold uppercase tracking-[0.15em] text-black/80">{user.email || user.username || 'Account'}</span>
                  <button
                    onClick={logout}
                    className="ml-2 text-xs font-ui font-semibold uppercase tracking-[0.15em] text-red-600 hover:text-black transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
              <a
                href="#pricing"
                className="px-5 py-2 bg-black text-cream text-xs font-ui font-semibold uppercase tracking-[0.12em] hover:bg-black-light transition"
              >
                Get Started
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-black transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-black transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-black transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="md:hidden overflow-hidden border-t-rule"
                style={{ borderColor: '#1A1A1A' }}
              >
                <div className="flex flex-col gap-4 px-6 py-6">
                  <a
                    href="#how-it-works"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-ui font-semibold uppercase tracking-widest text-black/60 hover:text-black"
                  >
                    How It Works
                  </a>
                  <a
                    href="#pricing"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-ui font-semibold uppercase tracking-widest text-black/60 hover:text-black"
                  >
                    Pricing
                  </a>
                  {!user ? (
                    <Link
                      to="/auth"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-ui font-semibold uppercase tracking-widest text-black/60 hover:text-black"
                    >
                      Sign In
                    </Link>
                  ) : (
                    <>
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="text-sm font-ui font-semibold uppercase tracking-widest text-[#E8714F] hover:text-black"
                        >
                          Dashboard
                        </Link>
                      )}
                      <span className="text-sm font-ui font-semibold uppercase tracking-widest text-black/80">{user.email || user.username || 'Account'}</span>
                      <button
                        onClick={() => { setMenuOpen(false); logout(); }}
                        className="ml-2 text-sm font-ui font-semibold uppercase tracking-widest text-red-600 hover:text-black"
                      >
                        Logout
                      </button>
                    </>
                  )}
                  <a
                    href="#pricing"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center px-5 py-3 bg-black text-cream text-sm font-ui font-semibold uppercase tracking-widest"
                  >
                    Get Started
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
