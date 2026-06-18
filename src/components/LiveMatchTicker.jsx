import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePLFixtures } from '../hooks/usePLFixtures'

/* ─── Club badge: real image with initials fallback ───────── */
function Badge({ url, name }) {
  const [imgErr, setImgErr] = useState(false)
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  if (url && !imgErr) {
    return (
      <img
        src={url}
        alt={name}
        onError={() => setImgErr(true)}
        className="w-8 h-8 object-contain flex-shrink-0 rounded-full"
        loading="lazy"
      />
    )
  }
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: 'rgba(183, 158, 79, 0.08)', border: '1px solid rgba(183, 158, 79, 0.18)' }}
    >
      <span className="font-data text-[10px] font-semibold text-cream/70">{initials}</span>
    </div>
  )
}

/* ─── Status badge ────────────────────────────────────────── */
function StatusBadge({ code, label }) {
  if (code === 'LIVE') return (
    <span className="flex items-center gap-1.5 bg-accent px-2 py-0.5 flex-shrink-0 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
      <span className="font-data text-cream text-[10px] font-bold tracking-widest">{label}</span>
    </span>
  )
  if (code === 'HT') return (
    <span className="border px-2 py-0.5 flex-shrink-0 rounded-full" style={{ borderColor: 'rgba(183, 158, 79, 0.24)' }}>
      <span className="font-data text-cream/70 text-[10px] tracking-widest">HT</span>
    </span>
  )
  if (code === 'FT') return (
    <span className="border px-2 py-0.5 flex-shrink-0 rounded-full" style={{ borderColor: 'rgba(183, 158, 79, 0.16)' }}>
      <span className="font-data text-cream/60 text-[10px] tracking-widest">FT</span>
    </span>
  )
  return (
    <span className="border px-2 py-0.5 flex-shrink-0 max-w-[130px]" style={{ borderColor: 'rgba(26,26,26,0.15)' }}>
      <span className="font-data text-cream/40 text-[9px] tracking-wide truncate block">{label}</span>
    </span>
  )
}

/* ─── Single match row ────────────────────────────────────── */
function MatchRow({ match }) {
  const [hovered, setHovered] = useState(false)
  const isLive  = match.statusCode === 'LIVE' || match.statusCode === 'HT'
  const hasScore = match.homeScore != null && match.awayScore != null

  return (
    <div
      className="relative flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 transition-colors cursor-default"
      style={{
        background:  hovered ? 'rgba(183, 158, 79, 0.08)' : 'rgba(255,255,255,0.015)',
        border:      '1px solid',
        borderColor: hovered ? 'rgba(183, 158, 79, 0.18)' : 'rgba(183, 158, 79, 0.12)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Home */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Badge url={match.homeBadge} name={match.home} />
        <span className={`font-ui text-sm truncate ${isLive ? 'text-cream' : 'text-cream/70'}`}>
          {match.home}
        </span>
      </div>

      {/* Score / time */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 w-36">
        {hasScore ? (
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-cream">{match.homeScore}</span>
            <span className="font-data text-cream/50 text-sm">—</span>
            <span className="font-display text-2xl text-cream">{match.awayScore}</span>
          </div>
        ) : (
          <span className="font-display text-xl text-cream/50">vs</span>
        )}
        <StatusBadge code={match.statusCode} label={match.statusLabel} />
      </div>

      {/* Away */}
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className={`font-ui text-sm truncate text-right ${isLive ? 'text-cream' : 'text-cream/70'}`}>
          {match.away}
        </span>
        <Badge url={match.awayBadge} name={match.away} />
      </div>

      {/* Hover overlay */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(13, 13, 13, 0.88)' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-data text-accent text-xs tracking-[0.2em] uppercase">
              Streaming Now on StreamPITV
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/* ─── Loading skeleton ────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4" style={{ border: '1px solid rgba(26,26,26,0.08)' }}>
      <div className="flex items-center gap-2 flex-1">
        <div className="w-8 h-8 rounded-full bg-black/10 animate-pulse" />
        <div className="h-3 w-28 rounded bg-black/10 animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-2 w-36">
        <div className="h-5 w-14 rounded bg-black/10 animate-pulse" />
        <div className="h-3 w-10 rounded bg-black/10 animate-pulse" />
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <div className="h-3 w-28 rounded bg-black/10 animate-pulse" />
        <div className="w-8 h-8 rounded-full bg-black/10 animate-pulse" />
      </div>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function LiveMatchTicker() {
  const { matches, loading, error, round } = usePLFixtures()

  const liveCount  = matches.filter(m => m.statusCode === 'LIVE').length
  const hasAnyLive = liveCount > 0

  return (
    <section className="py-28 px-6" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-5xl mx-auto">

        {/* Headline */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-data text-cream/70 text-xs tracking-[0.25em] uppercase mb-4">
            Right Now
          </p>
          <h2
            className="font-display text-[clamp(48px,8vw,96px)] leading-none text-cream"
            style={{ letterSpacing: '-0.02em' }}
          >
            THIS IS WHAT<br />
            <span className="text-accent">YOU'RE MISSING.</span>
          </h2>
          <p className="font-ui text-sm text-cream/70 mt-4 max-w-sm">
            Live Premier League fixtures — real data, real scores, updated every minute.
          </p>
        </motion.div>

        {/* Scoreboard */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.2 }}
          className="editorial-box overflow-hidden"
        >
          {/* Board header */}
          <div
            className="flex items-center justify-between px-6 py-3 border-b"
            style={{ borderColor: 'rgba(183, 158, 79, 0.16)', background: 'rgba(183, 158, 79, 0.04)' }}
          >
            <span className="font-data text-[11px] tracking-[0.2em] text-cream/70 uppercase">
              Premier League{round ? ` — Matchday ${round}` : ''}
            </span>
            {hasAnyLive ? (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-data text-accent text-[10px] tracking-widest">{liveCount} LIVE</span>
              </div>
            ) : (
              <span className="font-data text-cream/50 text-[10px] tracking-widest uppercase">Real Data</span>
            )}
          </div>

          {/* Match rows */}
          <div className="flex flex-col gap-1 p-3">
            {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
            {error && !loading && (
              <p className="py-10 text-center font-data text-cream/50 text-xs tracking-widest uppercase">
                Could not load fixtures
              </p>
            )}
            {!loading && !error && matches.length === 0 && (
              <p className="py-10 text-center font-data text-cream/50 text-xs tracking-widest uppercase">
                No fixtures available
              </p>
            )}
            {!loading && matches.map(match => (
              <MatchRow key={match.id} match={match} />
            ))}
          </div>
        </motion.div>

        {/* CTA below board */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mt-10 flex justify-center"
        >
          <a
            href="#pricing"
            className="px-8 py-4 bg-black text-cream font-ui font-semibold text-sm uppercase tracking-[0.14em] hover:bg-black-light transition"
          >
            Get Your Pass Now →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
