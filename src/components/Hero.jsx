import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNextKickoff } from '../hooks/useNextKickoff'

// Pexels free stadium floodlights video (CC0)
const HERO_VIDEO = 'src/assets/13433792_3840_2160_30fps.mp4'

const HEADLINE = ['EVERY', 'MATCH.', 'YOUR', 'SERVER.', 'NO', 'COMPROMISE.']

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
  const { scrollY } = useScroll()
  const videoY = useTransform(scrollY, [0, 800], [0, 320])

  const { hh, mm, ss, matchName } = useNextKickoff()

  return (
    <section
      ref={ref}
      id="hero"
      className="relative w-full h-screen min-h-[600px] flex items-center justify-start overflow-hidden grain"
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
          className="w-full h-full object-cover grayscale opacity-70"
          style={{ filter: 'grayscale(0.6) brightness(0.65) contrast(1.05)' }}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      </motion.div>

      {/* ── Mobile fallback gradient ── */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: 'linear-gradient(160deg, #0A0A0B 0%, #111213 60%, #0A0A0B 100%)' }}
      />

      {/* ── Stadium floodlight flare ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(255,220,100,0.06) 0%, transparent 55%)' }}
      />

      {/* ── Dark gradient vignette over video ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.5) 60%, rgba(10,10,11,0.2) 100%)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        {/* Eyebrow */}
        <p className="font-mono text-green text-xs tracking-[0.25em] uppercase mb-6 opacity-80">
          British Football Streaming
        </p>

        {/* Headline */}
        <motion.h1
          className="font-display text-[clamp(56px,11vw,144px)] leading-[0.92] text-snow max-w-3xl"
          style={{ letterSpacing: '-0.02em' }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {HEADLINE.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className={`inline-block mr-[0.1em] ${word === 'NO' || word === 'COMPROMISE.' ? 'text-green' : ''}`}
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
            className="whitespace-nowrap overflow-hidden"
          >
            <p className="font-mono text-green text-sm md:text-base tracking-wider">
              Server connected. Firmware loaded.{' '}
              <span className="text-snow/70">
                {matchName} starting in{' '}
              </span>
              <span className="text-green font-semibold">
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
            px-8 py-4 rounded-full
            bg-green text-pitch
            font-body font-semibold text-sm uppercase tracking-[0.14em]
            cursor-crosshair
            transition-[box-shadow]
            hover:animate-heartbeat
            focus:outline-none focus-visible:ring-2 focus-visible:ring-green
          "
          style={{ boxShadow: '0 0 0 0 rgba(170,255,69,0)' }}
          onMouseEnter={e => {
            e.currentTarget.style.animation = 'none'
            void e.currentTarget.offsetWidth
            e.currentTarget.style.animation = 'heartbeat 0.4s ease-out 1'
          }}
          onMouseLeave={e => { e.currentTarget.style.animation = '' }}
        >
          Get Your Kit
          <span className="text-base leading-none">→</span>
        </motion.a>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-5 font-body text-sm text-snow/40 tracking-wide"
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
        <span className="font-mono text-[10px] tracking-[0.2em] text-snow/30 uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-green/50 to-transparent" />
      </motion.div>
    </section>
  )
}
