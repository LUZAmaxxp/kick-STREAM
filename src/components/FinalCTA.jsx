import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function FinalCTA() {
  return (
    <section
      className="relative py-40 px-6 overflow-hidden texture-overlay"
      style={{ background: 'linear-gradient(180deg, rgba(13,13,13,0.95) 0%, rgba(22,22,20,0.98) 100%)' }}
    >
      {/* Editorial accent flare top-right */}
      <div
        className="absolute top-0 right-0 w-[60vw] h-[60vw] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(183, 158, 79, 0.18) 0%, transparent 60%)' }}
      />

      {/* Accent glow bottom-left for balance */}
      <div
        className="absolute bottom-0 left-0 w-[40vw] h-[40vw] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(183, 158, 79, 0.08) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-data text-accent text-xs tracking-[0.25em] uppercase mb-6"
        >
          Final Whistle
        </motion.p>

        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(52px,10vw,120px)] leading-[0.9] text-cream mb-6"
          style={{ letterSpacing: '-0.02em' }}
        >
          THE MATCH STARTS<br />
          WITH OR WITHOUT<br />
          <span className="text-accent">YOU.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-ui text-base text-cream/70 mb-12 max-w-md"
        >
          Live football, major sports, movies, series, and 20,000+ international channels — all in one place. Up and running in under five minutes on the devices you already own.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <a
            href="#pricing"
            className="px-8 py-4 bg-accent text-black font-ui font-semibold text-sm uppercase tracking-[0.14em] hover:bg-accent/90 transition"
          >
            Get Your Pass Now →
          </a>
          <a
            href="#pricing"
            className="px-8 py-4 border border-border text-cream/80 font-ui font-semibold text-sm uppercase tracking-[0.14em] hover:text-cream transition"
          >
            See Pricing
          </a>
        </motion.div>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 font-data text-xs text-cream/70 tracking-wide"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-black mr-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7l9-4 9 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
              <polyline points="3 7 12 11 21 7" />
              <path d="M12 11v10" />
            </svg>
          </span>
          Instant access. No contract. Cancel anytime.
        </motion.p>
      </div>
    </section>
  )
}
