import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function FinalCTA() {
  return (
    <section
      className="relative py-32 px-6 overflow-hidden bg-[#F5F3EE] border-y-2 border-[#1A1A1A]"
      style={{ borderRadius: 0 }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-mono text-[#00A651] text-xs tracking-[0.25em] uppercase mb-6"
        >
          Final Whistle
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-anton text-[clamp(52px,10vw,120px)] leading-[0.9] text-[#1A1A1A] mb-6 uppercase"
          style={{ letterSpacing: '-0.02em' }}
        >
          THE MATCH STARTS<br />
          WITH OR WITHOUT<br />
          <span className="text-[#00A651]">YOU.</span>
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-dmsans text-base text-[#4A4A44] mb-12 max-w-md"
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
            className="px-8 py-4 bg-[#1A1A1A] text-[#F5F3EE] font-anton text-[15px] tracking-[0.14em] border-0 rounded-none uppercase hover:bg-[#00A651] hover:text-[#F5F3EE] transition"
            style={{ borderRadius: 0 }}
          >
            Get Your Kit Now →
          </a>
          <a
            href="#pricing"
            className="px-8 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] font-anton text-[15px] tracking-[0.14em] border-solid rounded-none uppercase hover:bg-[#1A1A1A] hover:text-[#F5F3EE] transition"
            style={{ borderRadius: 0 }}
          >
            See Pricing
          </a>
        </motion.div>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 font-mono text-xs text-[#888880] tracking-wide"
        >
          📦 Ships within 48 hours. No contract. Cancel anytime.
        </motion.p>
      </div>
    </section>
  )
}

