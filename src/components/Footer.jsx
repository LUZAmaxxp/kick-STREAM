const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing',      href: '#pricing' },
  { label: 'FAQ',          href: '#faq' },
  { label: 'Sign In',      href: '#' },
]

const LEGAL = [
  { label: 'Privacy',  href: '#' },
  { label: 'Terms',    href: '#' },
  { label: 'Contact',  href: '#' },
]

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="relative pt-px">
      {/* Thin rule */}
      <div className="rule-top" style={{ borderColor: 'rgba(183, 158, 79, 0.16)' }} />

      <div className="px-6 py-16 bg-black text-cream">
        <div className="max-w-7xl mx-auto">

          {/* Top row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-16">

            {/* Wordmark + tagline */}
            <div>
              <a href="#" className="font-display text-3xl tracking-widest text-cream">
                KICKSTREAM
              </a>
              <p className="font-data text-xs text-cream/70 mt-2 tracking-[0.12em]">
                Live Sports, Movies & TV — All in One Place.
              </p>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap gap-8">
              {NAV_LINKS.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-cream/70 hover:text-accent transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-5">
              {[
                { icon: <XIcon />,         label: 'X / Twitter' },
                { icon: <InstagramIcon />, label: 'Instagram' },
                { icon: <YouTubeIcon />,   label: 'YouTube' },
              ].map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 border flex items-center justify-center text-cream/50 hover:text-accent hover:border-accent/20 transition-colors"
                  style={{ borderColor: 'rgba(183, 158, 79, 0.18)' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="rule-bottom" style={{ borderColor: 'rgba(183, 158, 79, 0.15)' }} />

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8">

            {/* Legal */}
            <div className="flex items-center gap-6">
              {LEGAL.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className="font-ui text-xs text-cream/70 hover:text-cream transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* Tagline */}
            <p className="font-data text-[11px] text-cream/60 tracking-[0.1em]">
              Trusted by customers every day to keep things simple, reliable, and easy to use.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
