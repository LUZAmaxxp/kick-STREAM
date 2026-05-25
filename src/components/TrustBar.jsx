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
      className="relative overflow-hidden bg-[#F5F3EE] border-y-2 border-[#1A1A1A]"
      style={{ borderRadius: 0 }}
    >
      <div
        className="flex whitespace-nowrap py-3 animate-marquee"
        style={{ animationPlayState: 'running' }}
        onMouseEnter={e => { e.currentTarget.style.animationPlayState = 'paused' }}
        onMouseLeave={e => { e.currentTarget.style.animationPlayState = 'running' }}
      >
        {TRACK.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-6">
            <span className="font-mono text-[13px] tracking-[0.18em] text-[#1A1A1A] uppercase">
              {item}
            </span>
            <span className="text-[#00A651] text-[13px] leading-none select-none">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
