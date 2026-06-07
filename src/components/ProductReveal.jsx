import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3h14v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V3z" />
        <path d="M9 11V7" />
        <path d="M15 11V7" />
        <path d="M7 15h10" />
        <path d="M9 19h6" />
      </svg>
    ),
    headline: 'The World Stage: Every Match, Every Moment',
    body: "Don't just watch the FIFA World Cup—experience it like you are sitting in the VIP box. When the entire world tunes in and public servers begin to lag, Kick-Stream keeps you anchored in flawless 4K at 60 FPS. From the nervous tension of the group stages to the absolute euphoria of the final whistle, follow your national team with high-priority streaming lines. No blackouts, no interrupted feeds, just pure, heart-pounding football history exactly as it happens.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16" />
        <path d="M4 12h16" />
        <path d="M6.5 6.5l11 11" />
      </svg>
    ),
    headline: 'Courtside Intensity & Global Athletics',
    body: "For the true fan, sports never sleep. Feel the energy of every crucial fourth-quarter buzzer-beater, every high-octane motorsport grid start, and every championship fight night. We don't just provide feeds; we deliver premium, high-bandwidth networks optimized for fast-motion athletics. It's the ultimate front-row sports pass, giving you real-time access to the games everyone is talking about, with zero lag during game-changing moments.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h16v10H4z" />
        <path d="M4 7l4-4h8l4 4" />
        <path d="M8 7v10" />
        <path d="M16 7v10" />
      </svg>
    ),
    headline: 'Your Private Cinema Lounge & Global Networks',
    body: "Escape the limits of regional television. Gain immediate access to an elite library of 20,000+ live international networks spanning the US, UK, Europe, Arabic regions, and beyond. Paired with a continuously updated Video-on-Demand (VOD) library overflowing with Hollywood masterpieces, trending global series, and complete family entertainment, your screen becomes the ultimate passport to global culture.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function ProductReveal() {
  return (
    <section id="product" className="py-24 px-6 max-w-7xl mx-auto" style={{ backgroundColor: 'transparent' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* ── Left: Device mockup ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="relative"
        >
          {/* Outer shadow box */}
          <div className="absolute -inset-4" style={{ background: 'radial-gradient(ellipse at center, rgba(183, 158, 79, 0.12) 0%, transparent 70%)' }} />

          {/* TV / monitor bezel */}
          <div className="relative editorial-box p-3 bg-black/75 border border-border rounded-[22px] overflow-hidden">
            <div className="overflow-hidden aspect-video bg-black flex items-center justify-center relative">
              {/* Fake match HUD */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/95" />

              {/* Score bar */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/85 px-4 py-1.5 border border-border rounded-full">
                <span className="font-display text-cream text-lg tracking-widest">ARS</span>
                <span className="font-data text-accent text-xl font-bold">2 — 1</span>
                <span className="font-display text-cream text-lg tracking-widest">CHE</span>
              </div>

              {/* LIVE badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-accent px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                <span className="font-data text-black text-[10px] font-bold tracking-widest">LIVE</span>
              </div>

              {/* Pitch */}
              <div className="w-full h-full opacity-20">
                <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" stroke="rgba(183, 158, 79, 0.55)" strokeWidth="1">
                  <rect x="10" y="10" width="300" height="160"/>
                  <line x1="160" y1="10" x2="160" y2="170"/>
                  <circle cx="160" cy="90" r="28"/>
                  <rect x="10" y="55" width="42" height="70"/>
                  <rect x="268" y="55" width="42" height="70"/>
                  <rect x="10" y="70" width="18" height="40"/>
                  <rect x="292" y="70" width="18" height="40"/>
                </svg>
              </div>

              {/* HD badge */}
              <div className="absolute bottom-3 left-3 border border-accent/20 px-2 py-0.5 rounded-full">
                <span className="font-data text-cream text-[10px] tracking-widest">4K HD</span>
              </div>

              {/* Waveform */}
              <div className="absolute bottom-3 right-3 flex items-end gap-0.5 h-6">
                {[3,6,4,8,5,10,7,4,9,5,6,3,8,6,4].map((h, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-accent/70 rounded-full"
                    style={{ height: `${h * 2}px`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Stand */}
            <div className="flex justify-center mt-2">
              <div className="w-16 h-1 bg-cream/15" />
            </div>
          </div>
        </motion.div>

        {/* ── Right: Features ── */}
        <div className="flex flex-col gap-10">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12 }}
              className="flex gap-5 items-start"
            >
              <div className="flex-shrink-0 w-10 h-10 border-rule flex items-center justify-center text-accent">
                {f.icon}
              </div>
              <div>
                <h3 className="font-display text-2xl tracking-wider text-cream mb-1">
                  {f.headline}
                </h3>
                <p className="font-ui text-sm text-cream/70 leading-relaxed">
                  {f.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
