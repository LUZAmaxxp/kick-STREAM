import { motion } from 'framer-motion'

const deviceIcons = {
  tv: (
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-accent" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="14" width="44" height="28" rx="4" />
      <path d="M20 42h24" />
      <path d="M26 48h12" />
      <path d="M18 14l-6-8" />
      <path d="M46 14l6-8" />
    </svg>
  ),
  hardware: (
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-accent" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="18" width="40" height="22" rx="5" />
      <path d="M22 42v6" />
      <path d="M42 42v6" />
      <path d="M18 26h28" />
      <path d="M24 18v-8" />
      <path d="M40 18v-8" />
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-accent" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="12" width="24" height="40" rx="6" />
      <path d="M24 16h16" />
      <path d="M32 46h0" />
    </svg>
  ),
  laptop: (
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-accent" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="16" width="44" height="24" rx="3" />
      <path d="M10 40h44" />
      <path d="M18 46h28" />
      <path d="M24 48l4 4h8l4-4" />
    </svg>
  ),
}

function StatItem({ icon, label, glow }) {
  return (
    <div className="flex flex-col items-center gap-6 relative text-center">
      {glow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(183,158,79,0.12) 0%, transparent 65%)' }}
        />
      )}
      <div className="relative flex items-center justify-center w-28 h-28 rounded-[30px] border border-border bg-black/70 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
        {deviceIcons[icon]}
      </div>
      <p className="font-ui text-sm text-cream/70 tracking-wide uppercase">
        {label}
      </p>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Stats() {
  return (
    <section className="py-28 px-6 texture-overlay overflow-hidden" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-7xl mx-auto">

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-data text-cream/70 text-xs tracking-[0.25em] uppercase mb-4 text-center"
        >
          Device Compatibility
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(40px,6vw,72px)] text-cream mb-4 text-center leading-none"
        >
          Zero Friction. Instant Viewing on Any Screen.
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-ui text-sm text-cream/60 mb-16 text-center max-w-2xl mx-auto"
        >
          True modern luxury means never fighting with technology. Kick-Stream integrates seamlessly with your current lifestyle in under 5 minutes, requiring no advanced technical skills or complicated setups.
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0 }}>
            <StatItem icon="tv" label="Smart TVs" glow={false} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0.12 }}>
            <StatItem icon="hardware" label="Streaming Hardware" glow={true} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0.24 }}>
            <StatItem icon="mobile" label="Mobiles & Tablets" glow={false} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0.36 }}>
            <StatItem icon="laptop" label="Desktops & Laptops" glow={true} />
          </motion.div>
        </div>

      </div>
    </section>
  )
}
