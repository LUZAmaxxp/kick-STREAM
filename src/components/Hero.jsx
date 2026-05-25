import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNextKickoff } from '../hooks/useNextKickoff'

// Pexels free stadium floodlights video (CC0)
const HERO_VIDEO = 'src/assets/13433792_3840_2160_30fps.mp4'

const HEADLINE = ['THE', 'MATCH', 'STARTS', 'WITH', 'OR', 'WITHOUT', 'YOU.']

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

const typeVariants = {
  hidden: { width: '0%' },
  show:   { width: '100%', transition: { duration: 1.8, delay: 0.8, ease: 'easeOut' } },
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']) // Adjust as needed
  const { hh, mm, ss, matchName } = useNextKickoff()

  return (
    <section
      ref={ref}
      id="hero"
      className="relative w-full h-screen min-h-[600px] flex items-center justify-start overflow-hidden texture-overlay"
      style={{ backgroundColor: '#F5F3EE' }}
    >
      {/* ── Video background (hidden on mobile) ── */}
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-0 hidden md:block"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(0.3) brightness(1.1) contrast(0.9)' }}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      </motion.div>

      {/* ── Mobile fallback gradient ── */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: 'linear-gradient(160deg, #F5F3EE 0%, #FAFAF8 60%, #F5F3EE 100%)' }}
      />

      {/* ── Light editorial vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(245, 243, 238, 0.85) 0%, rgba(245, 243, 238, 0.4) 60%, rgba(245, 243, 238, 0) 100%)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        {/* Eyebrow */}
        <p className="font-data text-black text-xs tracking-[0.25em] uppercase mb-6 opacity-70">
          British Football Streaming
        </p>

        {/* Headline */}
        <motion.h1
          className="font-display text-[clamp(56px,11vw,144px)] leading-[0.92] text-black max-w-3xl"
          style={{ letterSpacing: '-0.02em' }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {HEADLINE.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className={`inline-block mr-[0.1em] ${word === 'YOU.' ? 'text-accent' : ''}`}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Monospace typing line */}
        <div className="mt-8 mb-10 overflow-hidden">
          <motion.div
            variants={typeVariants}
            initial="hidden"
            animate="show"
          >
            <p className="font-data text-black text-sm md:text-base tracking-wider">
              Server connected. Firmware loaded.{' '}
              <span className="text-black/60">
                {matchName} starting in{' '}
              </span>
              <span className="text-accent font-semibold">
                {hh}:{mm}:{ss}
              </span>
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.a
          href="#pricing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="
            inline-flex items-center gap-2
            px-8 py-4
            bg-black text-cream
            font-ui font-semibold text-sm uppercase tracking-[0.14em]
            transition-all
            hover:shadow-editorial
            focus:outline-none focus-visible:ring-2 focus-visible:ring-black
          "
          style={{ boxShadow: '4px 4px 0px rgba(26, 26, 26, 0.3)' }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '8px 8px 0px rgba(26, 26, 26, 0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '4px 4px 0px rgba(26, 26, 26, 0.3)'
          }}
        >
          Get Your Kit
          <span className="text-base leading-none">→</span>
        </motion.a>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-5 font-ui text-sm text-black/50 tracking-wide"
        >
          Ships within 48 hours. No contract. Cancel anytime.
        </motion.p>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-data text-[10px] tracking-[0.2em] text-black/40 uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-black/30 to-transparent" />
      </motion.div>
    </section>
  )
}