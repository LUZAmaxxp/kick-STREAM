import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing',      href: '#pricing' },
  { label: 'Sign In',      href: '#' },
]

export default function Nav() {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
          className="fixed top-0 left-0 right-0 z-50 border-b-2 border-[#1A1A1A] bg-[#F5F3EE]"
          style={{ boxShadow: 'none', borderRadius: 0 }}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Wordmark with green underline under K */}
            <a href="#" className="font-anton text-[24px] tracking-[-0.01em] text-[#1A1A1A] relative select-none" style={{ fontVariant: 'all-small-caps' }}>
              <span className="relative">
                <span className="inline-block relative">
                  K
                  <span className="absolute left-0 right-0 bottom-[-2px] h-[2px] bg-[#00A651] w-full" style={{ zIndex: 1 }} />
                </span>
                ICK
              </span>
              <span className="ml-1">STREAM</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className="font-dmsans text-[13px] text-[#4A4A44] uppercase tracking-[0.08em] hover:text-[#1A1A1A] hover:underline hover:underline-offset-4 hover:decoration-[#00A651] transition-colors"
                  style={{ textDecorationThickness: 2 }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#pricing"
                className="bg-[#1A1A1A] text-[#F5F3EE] font-anton text-[14px] tracking-[0.06em] px-6 py-2 ml-2 border-0 rounded-none uppercase hover:bg-[#00A651] hover:text-[#F5F3EE] transition shadow-none hover:shadow-[3px_3px_0_rgba(0,166,81,0.3)]"
                style={{ borderRadius: 0 }}
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
              <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
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
                className="md:hidden overflow-hidden border-b-2 border-[#1A1A1A] bg-[#F5F3EE]"
              >
                <div className="flex flex-col gap-4 px-6 py-6">
                  {NAV_LINKS.map(l => (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-dmsans text-[15px] text-[#4A4A44] uppercase tracking-[0.08em] hover:text-[#1A1A1A] hover:underline hover:underline-offset-4 hover:decoration-[#00A651] transition-colors"
                      style={{ textDecorationThickness: 2 }}
                    >
                      {l.label}
                    </a>
                  ))}
                  <a
                    href="#pricing"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center bg-[#1A1A1A] text-[#F5F3EE] font-anton text-[14px] tracking-[0.06em] px-6 py-3 border-0 rounded-none uppercase hover:bg-[#00A651] hover:text-[#F5F3EE] transition shadow-none hover:shadow-[3px_3px_0_rgba(0,166,81,0.3)]"
                    style={{ borderRadius: 0 }}
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
