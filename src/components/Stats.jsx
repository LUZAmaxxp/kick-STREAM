import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'

function StatItem({ value, suffix, label, glow }) {
  const [ref, display] = useCountUp(value)

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-3 relative"
    >
      {glow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(170,255,69,0.08) 0%, transparent 65%)' }}
        />
      )}
      <span className="font-display text-[clamp(56px,9vw,112px)] leading-none text-snow relative" style={{ letterSpacing: '-0.03em' }}>
        {display}
        <span className="text-green">{suffix}</span>
      </span>
      <p className="font-body text-sm text-snow/40 tracking-wide uppercase text-center">
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
    <section className="py-28 px-6 grain overflow-hidden" style={{ background: '#08080A' }}>
      <div className="max-w-7xl mx-auto">

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-mono text-green text-xs tracking-[0.25em] uppercase mb-16 text-center"
        >
          By the numbers
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0 }}>
            <StatItem value={4} suffix="K" label="Stream quality. Every match." glow={false} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0.12 }}>
            <StatItem value={3} suffix="s" label="Average latency. Not minutes." glow={true} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0.24 }}>
            <StatItem value={99} suffix=".9%" label="Uptime. Engineered, not promised." glow={false} />
          </motion.div>
        </div>

      </div>
    </section>
  )
}
