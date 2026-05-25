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
  const { hh, mm, ss, matchName } = useNextKickoff()

  return (
    <section
      ref={ref}
      id="hero"
      className="relative w-full min-h-[480px] flex items-stretch justify-center bg-[#F5F3EE] grain border-b-2 border-[#1A1A1A] overflow-hidden"
      style={{ boxShadow: 'none', borderRadius: 0 }}
    >
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none opacity-20"
        src={HERO_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      {/* Top thick black rule */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#1A1A1A] z-10" />
      <div className="relative z-20 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-16 gap-8">
        {/* Left column: headline, eyebrow, CTAs */}
        <div className="flex-1 flex flex-col justify-center min-w-[260px] max-w-[54%]">
          {/* Eyebrow with live dot */}
          <div className="flex items-center mb-6">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D42B2B] mr-2 animate-pulse" style={{ animation: 'pulse 1.5s infinite' }} />
            <span className="font-mono text-[12px] text-[#888880] tracking-[0.15em] uppercase">LIVE STREAMING PLATFORM — UNITED KINGDOM</span>
          </div>
          {/* Headline with wipe animation */}
          <motion.h1
            className="font-anton text-[clamp(36px,7vw,80px)] leading-[0.98] text-[#1A1A1A] mb-4"
            style={{ letterSpacing: '-0.01em', textTransform: 'uppercase' }}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {HEADLINE.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className={`inline-block mr-[0.1em] ${word === 'NO' || word === 'COMPROMISE.' ? 'text-[#00A651]' : ''}`}
                style={{
                  clipPath: 'inset(0 100% 0 0)',
                  animation: `wipe-reveal 0.6s cubic-bezier(0.25,0.46,0.45,0.94) forwards`,
                  animationDelay: `${i * 0.06 + 0.2}s`
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          {/* Subheadline */}
          <p className="font-librebask text-[15px] text-[#4A4A44] max-w-[420px] leading-[1.6] mb-6">
            The only match-day streaming platform designed for real fans. Editorial, fast, and always on.
          </p>
          {/* Monospace typing line */}
          <div className="mb-6">
            <motion.div
              variants={typeVariants}
              initial="hidden"
              animate="show"
              className="whitespace-nowrap overflow-hidden"
            >
              <span className="font-mono text-[#00A651] text-base tracking-wider">
                Server connected. Firmware loaded.{' '}
                <span className="text-[#4A4A44]">
                  {matchName} starting in{' '}
                </span>
                <span className="text-[#00A651] font-semibold">
                  {hh}:{mm}:{ss}
                </span>
              </span>
            </motion.div>
          </div>
          {/* CTA buttons */}
          <div className="flex gap-3">
            <a
              href="#pricing"
              className="bg-[#1A1A1A] text-[#F5F3EE] font-anton text-[15px] tracking-[0.08em] px-7 py-3 border-0 rounded-none uppercase hover:bg-[#00A651] hover:text-[#F5F3EE] transition"
              style={{ borderRadius: 0 }}
            >
              Get Your Kit Now →
            </a>
            <a
              href="#pricing"
              className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-anton text-[15px] tracking-[0.08em] px-7 py-3 border-solid rounded-none uppercase hover:bg-[#1A1A1A] hover:text-[#F5F3EE] transition"
              style={{ borderRadius: 0 }}
            >
              See Pricing
            </a>
          </div>
        </div>
        {/* Right column: decorative watermark and match stats card */}
        <div className="flex-1 flex flex-col items-center justify-center relative max-w-[46%] min-w-[220px]">
          {/* Giant 90' watermark, smaller */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-anton text-[120px] md:text-[180px] text-[#1A1A1A]/5 select-none pointer-events-none" style={{ zIndex: 0 }}>
            90'
          </span>
          {/* Example match stats card (can be replaced with real data) */}
          <div className="relative z-10 bg-[#E4E1D8] border-[1.5px] border-[#1A1A1A1A] shadow-[4px_4px_0_rgba(26,26,26,0.15)] px-7 py-6 mt-10" style={{ borderRadius: 0 }}>
            <div className="font-dmsans text-[13px] text-[#4A4A44] uppercase tracking-[0.08em] mb-2">Next Match</div>
            <div className="font-anton text-[28px] md:text-[34px] text-[#1A1A1A] mb-1">{matchName}</div>
            <div className="font-mono text-[14px] text-[#888880]">Kickoff in <span className="text-[#00A651]">{hh}:{mm}:{ss}</span></div>
          </div>
        </div>
      </div>
      {/* Bottom black rule */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A1A1A] z-10" />
    </section>
  )
}
