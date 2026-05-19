import { motion } from 'framer-motion'

const PLANS = [
  {
    id: 'terrace',
    name: 'TERRACE',
    price: '£9',
    period: '/mo',
    description: 'For the casual supporter who wants a reliable stream without the commitment.',
    features: [
      'Single device',
      'HD 1080p quality',
      'All Premier League fixtures',
      'Standard latency (< 8s)',
      'Email support',
    ],
    cta: 'Get Terrace',
    ctaStyle: 'border',
    popular: false,
  },
  {
    id: 'season',
    name: 'SEASON TICKET',
    price: '£69',
    period: '/yr',
    description: 'The fan choice. Best value, best performance, best experience.',
    features: [
      'Two devices',
      '4K Ultra HD',
      'All fixtures inc. FA Cup & EFL',
      'Sub 3-second latency',
      'Priority 24/7 support',
      'Firmware auto-updates',
    ],
    cta: 'Get Season Ticket',
    ctaStyle: 'solid-green',
    popular: true,
  },
  {
    id: 'boardroom',
    name: 'BOARDROOM',
    price: '£149',
    period: '/yr',
    description: 'For the household that argues over the remote. Four devices, zero compromises.',
    features: [
      'Four devices simultaneously',
      '4K Ultra HD',
      'All competitions + International',
      'Sub 3-second latency',
      'Dedicated account manager',
      'Priority shipping',
    ],
    cta: 'Get Boardroom',
    ctaStyle: 'solid-white',
    popular: false,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6 bg-surface/20">
      <div className="max-w-7xl mx-auto">

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-mono text-green text-xs tracking-[0.25em] uppercase mb-4"
        >
          Pricing
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(40px,6vw,72px)] text-snow mb-4 leading-none"
        >
          ONE PRICE. EVERY MATCH.
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-body text-sm text-snow/40 mb-16 max-w-md"
        >
          No blackouts. No upsells. No broadcaster telling you which games you're allowed to watch.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12 }}
              className={`relative surface-card p-8 flex flex-col gap-6 ${plan.popular ? 'md:-translate-y-4 animate-breathe' : ''}`}
              style={plan.popular ? { boxShadow: '0 0 40px rgba(170,255,69,0.12), 0 0 0 1px rgba(170,255,69,0.25)' } : {}}
            >
              {/* MOST POPULAR badge */}
              {plan.popular && (
                <div className="absolute -top-3 right-6 bg-green text-pitch font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full font-semibold">
                  MOST POPULAR
                </div>
              )}

              {/* Plan name */}
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-snow/40 uppercase mb-2">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="font-display text-[64px] leading-none text-snow" style={{ letterSpacing: '-0.03em' }}>
                    {plan.price}
                  </span>
                  <span className="font-body text-sm text-snow/40 mb-2">{plan.period}</span>
                </div>
                <p className="font-body text-sm text-snow/50 leading-relaxed mt-2">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3" stroke="#AAFF45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-body text-sm text-snow/70">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#"
                className={`
                  mt-auto text-center py-3.5 rounded-full text-sm font-body font-semibold uppercase tracking-[0.12em] transition-all
                  ${plan.ctaStyle === 'border'      ? 'border border-snow/20 text-snow/70 hover:border-snow/50 hover:text-snow' : ''}
                  ${plan.ctaStyle === 'solid-green' ? 'bg-green text-pitch hover:brightness-110 cursor-crosshair' : ''}
                  ${plan.ctaStyle === 'solid-white' ? 'bg-snow text-pitch hover:brightness-95' : ''}
                `}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
