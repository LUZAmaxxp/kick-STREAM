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
    <section id="product" className="py-20 px-6 max-w-7xl mx-auto border-b-2 border-[#1A1A1A] bg-[#F5F3EE]" style={{ borderRadius: 0 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Device mockup, hard-edged */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="relative"
        >
          {/* Hard border, no glow */}
          <div className="absolute -inset-2 border-2 border-[#1A1A1A] pointer-events-none" style={{ borderRadius: 0 }} />
          {/* TV / monitor bezel */}
          <div className="relative bg-[#E4E1D8] border-2 border-[#1A1A1A] p-3" style={{ borderRadius: 0, boxShadow: 'none' }}>
            <div className="overflow-hidden aspect-video bg-[#D9D7D0] flex items-center justify-center relative" style={{ borderRadius: 0 }}>
              {/* Fake match HUD */}
              {/* Score bar */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#1A1A1A] px-4 py-1.5" style={{ borderRadius: 0 }}>
                <span className="font-anton text-[#F5F3EE] text-lg tracking-widest">ARS</span>
                <span className="font-mono text-[#00A651] text-xl font-bold">2 — 1</span>
                <span className="font-anton text-[#F5F3EE] text-lg tracking-widest">CHE</span>
              </div>
              {/* Pitch */}
              <div className="w-full h-full opacity-10">
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
              <div className="absolute bottom-3 left-3 border border-[#00A651] px-2 py-0.5" style={{ borderRadius: 0 }}>
                <span className="font-mono text-[#00A651] text-[10px] tracking-widest">4K HD</span>
              </div>
            </div>
            {/* Stand */}
            <div className="flex justify-center mt-2">
              <div className="w-16 h-1 bg-[#D9D7D0]" style={{ borderRadius: 0 }} />
            </div>
          </div>
        </motion.div>
        {/* Right: Features, editorial style */}
        <div className="flex flex-col gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="flex items-start gap-5 border-b border-[#1A1A1A] pb-6 last:border-b-0 last:pb-0"
              style={{ borderRadius: 0 }}
            >
              <div className="mt-1 text-[#00A651]">{f.icon}</div>
              <div>
                <div className="font-anton text-[22px] text-[#1A1A1A] mb-1 uppercase tracking-tight">{f.headline}</div>
                <div className="font-dmsans text-[15px] text-[#4A4A44]">{f.body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
