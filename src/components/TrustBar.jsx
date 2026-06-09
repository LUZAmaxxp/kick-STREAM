const ITEMS = [
  '20,000+ LIVE GLOBAL NETWORKS',
  'PREMIER LEAGUE · CHAMPIONS LEAGUE · LA LIGA',
  'NFL · NBA · UFC · FORMULA 1 · BOXING',
  'MOVIES, SERIES & DOCUMENTARIES',
  'SMART TVS, FIRESTICK & ANDROID TV',
  'MOBILES, TABLETS & DESKTOPS',
  'SIMPLE SETUP — UNDER 5 MINUTES',
  '99.9% UPTIME RECORD',
]

// Duplicate for seamless infinite scroll
const TRACK = [...ITEMS, ...ITEMS]

export default function TrustBar() {
  return (
    <div
      className="relative overflow-hidden texture-overlay"
      style={{ backgroundColor: '#0D0D0D', borderTop: '2px solid rgba(183, 158, 79, 0.14)', borderBottom: '2px solid rgba(183, 158, 79, 0.14)' }}
    >
      <div
        className="flex whitespace-nowrap py-4 animate-marquee"
        style={{ animationPlayState: 'running' }}
        onMouseEnter={e => { e.currentTarget.style.animationPlayState = 'paused' }}
        onMouseLeave={e => { e.currentTarget.style.animationPlayState = 'running' }}
      >
        {TRACK.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-4">
            <span className="font-data text-xs tracking-[0.18em] text-cream/70 uppercase">
              {item}
            </span>
            <span className="text-accent text-xs leading-none select-none">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
