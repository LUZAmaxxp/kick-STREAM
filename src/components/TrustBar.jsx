const ITEMS = [
  '12,000+ ACTIVE STREAMS',
  'COVERAGE: ALL PREMIER LEAGUE FIXTURES',
  'LATENCY UNDER 3 SECONDS',
  'BRITISH SERVERS. BRITISH FOOTBALL.',
  'NO CONTRACT. CANCEL ANYTIME.',
  '4K QUALITY ON EVERY DEVICE',
  'SHIPS IN 48 HOURS',
  '99.9% UPTIME GUARANTEED',
]

// Duplicate for seamless infinite scroll
const TRACK = [...ITEMS, ...ITEMS]

export default function TrustBar() {
  return (
    <div
      className="relative overflow-hidden rule-top rule-bottom texture-overlay"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      <div
        className="flex whitespace-nowrap py-4 animate-marquee"
        style={{ animationPlayState: 'running' }}
        onMouseEnter={e => { e.currentTarget.style.animationPlayState = 'paused' }}
        onMouseLeave={e => { e.currentTarget.style.animationPlayState = 'running' }}
      >
        {TRACK.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-4">
            <span className="font-data text-xs tracking-[0.18em] text-cream/80 uppercase">
              {item}
            </span>
            <span className="text-accent text-xs leading-none select-none">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
