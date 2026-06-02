import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNextKickoff } from '../hooks/useNextKickoff'
import heroVideo from '../assets/13433792_3840_2160_30fps.mp4'
import heroVideoMobile from '../assets/13406407_1080_1920_30fps.mp4'
import heroPoster from '../assets/hero-poster.svg'

// Pexels free stadium floodlights video (CC0)
const HERO_VIDEO = heroVideo
const HERO_VIDEO_MOBILE = heroVideoMobile
const HERO_VIDEO_OPTIMIZED = '/media/hero-desktop-optimized.mp4'
const HERO_VIDEO_MOBILE_OPTIMIZED = '/media/hero-mobile-optimized.mp4'

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
  const mobileVideoRef = useRef(null)
  const { scrollY } = useScroll()
  const videoY = useTransform(scrollY, [0, 800], [0, 320])
  const [loadDesktopVideo, setLoadDesktopVideo] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    const saveData = Boolean(conn && conn.saveData)
    const slowNetwork = /2g/.test((conn && conn.effectiveType) || '')
    const isDesktop = window.matchMedia('(min-width: 768px)').matches

    if (!isDesktop || saveData || slowNetwork) return

    let timer = null
    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(() => setLoadDesktopVideo(true), { timeout: 1200 })
      return () => window.cancelIdleCallback(idleId)
    }

    timer = window.setTimeout(() => setLoadDesktopVideo(true), 600)
    return () => {
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const v = mobileVideoRef.current
    if (!v) return

    const forcePlay = () => {
      v.muted = true
      v.defaultMuted = true
      v.loop = true
      v.playsInline = true
      const p = v.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Mobile browsers may require a later retry after first interaction.
        })
      }
    }

    forcePlay()

    const onFirstInteraction = () => {
      forcePlay()
      window.removeEventListener('touchstart', onFirstInteraction)
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('click', onFirstInteraction)
    }

    const onVisible = () => {
      if (!document.hidden) forcePlay()
    }

    window.addEventListener('touchstart', onFirstInteraction, { passive: true })
    window.addEventListener('pointerdown', onFirstInteraction, { passive: true })
    window.addEventListener('click', onFirstInteraction, { passive: true })
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.removeEventListener('touchstart', onFirstInteraction)
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('click', onFirstInteraction)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

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
          preload="none"
          poster={heroPoster}
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(0.3) brightness(1.1) contrast(0.9)' }}
        >
          {loadDesktopVideo && <source src={HERO_VIDEO_OPTIMIZED} type="video/mp4" />}
          {loadDesktopVideo && <source src={HERO_VIDEO} type="video/mp4" />}
        </video>
      </motion.div>

      {/* ── Mobile video ── */}
      <div className="absolute inset-0 md:hidden">
        <video
          ref={mobileVideoRef}
          autoPlay
          muted
          defaultMuted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          poster={heroPoster}
          preload="metadata"
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(0.25) brightness(1.06) contrast(0.9)' }}
        >
          <source src={HERO_VIDEO_MOBILE_OPTIMIZED} type="video/mp4" />
          <source src={HERO_VIDEO_MOBILE} type="video/mp4" />
        </video>
      </div>

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
              className={`inline-block mr-[0.1em] ${word === 'NO' || word === 'COMPROMISE.' ? 'text-accent' : ''}`}
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
