import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function FinalCTA() {
  return (
    <section
      className="relative py-40 px-6 overflow-hidden texture-overlay"
      style={{ background: 'linear-gradient(180deg, #F5F3EE 0%, #FAFAF8 100%)' }}
    >
      {/* Editorial accent flare top-right */}
      <div
        className="absolute top-0 right-0 w-[60vw] h-[60vw] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(232, 113, 79, 0.08) 0%, transparent 60%)' }}
      />

      {/* Accent glow bottom-left for balance */}
      <div
        className="absolute bottom-0 left-0 w-[40vw] h-[40vw] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(232, 113, 79, 0.04) 0%, transparent 65%)' }}
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
          className="font-display text-[clamp(52px,10vw,120px)] leading-[0.9] text-black mb-6"
          style={{ letterSpacing: '-0.02em' }}
        >
          THE MATCH STARTS<br />
          WITH OR WITHOUT<br />
          <span className="text-accent">YOU.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-ui text-base text-black/60 mb-12 max-w-md"
        >
          Join 12,000 fans who chose their own stream. No blackouts, no compromises, no middleman.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <a
            href="#pricing"
            className="px-8 py-4 bg-accent text-cream font-ui font-semibold text-sm uppercase tracking-[0.14em] hover:bg-accent transition"
          >
            Get Your Kit Now →
          </a>
          <a
            href="#pricing"
            className="px-8 py-4 border text-black/70 font-ui font-semibold text-sm uppercase tracking-[0.14em] hover:text-black transition"
            style={{ borderColor: 'rgba(26, 26, 26, 0.2)' }}
          >
            See Pricing
          </a>
        </motion.div>

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 font-data text-xs text-black/50 tracking-wide"
        >
          📦 Ships within 48 hours. No contract. Cancel anytime.
        </motion.p>
      </div>
    </section>
  )
}
