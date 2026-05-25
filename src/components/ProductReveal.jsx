import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    headline: 'YOUR OWN SERVER',
    body: 'Dedicated hardware allocated to you alone. Not shared bandwidth, not pooled streams — your signal, your stability.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    headline: 'FIRMWARE KIT INCLUDED',
    body: 'Plug in and stream. Zero technical experience needed. The kit arrives pre-configured and ready for kick-off.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    headline: 'ALL KICK-OFF TIMES COVERED',
    body: 'From 12:30 Saturday to Monday night. Every Premier League, Championship, and FA Cup fixture.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function ProductReveal() {
  return (
    <section id="product" className="py-24 px-6 max-w-7xl mx-auto">
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
          <div className="absolute -inset-4" style={{ background: 'radial-gradient(ellipse at center, rgba(26,26,26,0.08) 0%, transparent 70%)' }} />

          {/* TV / monitor bezel */}
          <div className="relative editorial-box p-3">
            <div className="overflow-hidden aspect-video bg-cream-light flex items-center justify-center relative">
              {/* Fake match HUD */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#f0ebe3] via-[#f5f3ee] to-[#f5f3ee]" />

              {/* Score bar */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 px-4 py-1.5 border border-black/10">
                <span className="font-display text-black text-lg tracking-widest">ARS</span>
                <span className="font-data text-accent text-xl font-bold">2 — 1</span>
                <span className="font-display text-black text-lg tracking-widest">CHE</span>
              </div>

              {/* LIVE badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-accent px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cream animate-pulse" />
                <span className="font-data text-cream text-[10px] font-bold tracking-widest">LIVE</span>
              </div>

              {/* Pitch */}
              <div className="w-full h-full opacity-8">
                <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" stroke="#1A1A1A" strokeWidth="1">
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
              <div className="absolute bottom-3 left-3 border border-black/20 px-2 py-0.5">
                <span className="font-data text-black text-[10px] tracking-widest">4K HD</span>
              </div>

              {/* Waveform */}
              <div className="absolute bottom-3 right-3 flex items-end gap-0.5 h-6">
                {[3,6,4,8,5,10,7,4,9,5,6,3,8,6,4].map((h, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-accent/60 rounded-full"
                    style={{ height: `${h * 2}px`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Stand */}
            <div className="flex justify-center mt-2">
              <div className="w-16 h-1 bg-black/10" />
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
                <h3 className="font-display text-2xl tracking-wider text-black mb-1">
                  {f.headline}
                </h3>
                <p className="font-ui text-sm text-black/60 leading-relaxed">
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
