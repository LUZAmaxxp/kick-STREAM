import { motion } from 'framer-motion'

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9',
    period: '/mo',
    description: 'Unlimited access to every match for 30 days. Cancel anytime.',
    features: [
      'All Premier League matches',
      'HD streaming',
      'Watch on any device',
      'No blackouts or region locks',
    ],
    cta: 'Get Monthly',
    popular: false,
  },
  {
    id: 'season',
    name: 'Season Pass',
    price: '$49',
    period: '/season',
    description: 'Best value. Every match, all season long. One payment.',
    features: [
      'All Premier League matches',
      'HD streaming',
      'Watch on any device',
      'No blackouts or region locks',
      'Priority support',
    ],
    cta: 'Get Season Pass',
    popular: true,
  },
  {
    id: 'weekend',
    name: 'Weekend',
    price: '$4',
    period: '/wknd',
    description: 'Perfect for catching all the action this weekend only.',
    features: [
      'All Premier League matches',
      'HD streaming',
      'Watch on any device',
    ],
    cta: 'Get Weekend',
    popular: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6" style={{ backgroundColor: '#F5F3EE' }}>
      <div className="max-w-7xl mx-auto">
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-data text-black text-xs tracking-[0.25em] uppercase mb-4 opacity-60"
        >
          Pricing
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(40px,6vw,72px)] text-black mb-4 leading-none"
        >
          ONE PRICE. EVERY MATCH.
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-ui text-sm text-black/60 mb-16 max-w-md"
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
              className={`relative editorial-box p-8 flex flex-col gap-6 ${plan.popular ? 'md:-translate-y-4' : ''}`}
              style={plan.popular ? { boxShadow: '8px 8px 0px rgba(26, 26, 26, 0.4)' } : { boxShadow: '4px 4px 0px rgba(26, 26, 26, 0.2)' }}
            >
              {/* MOST POPULAR badge */}
              {plan.popular && (
                <div className="absolute -top-4 right-6 bg-accent text-cream font-data text-[10px] tracking-[0.2em] uppercase px-3 py-1 font-semibold border border-black">
                  MOST POPULAR
                </div>
              )}
              {/* Plan name */}
              <div>
                <p className="font-data text-[11px] tracking-[0.2em] text-black/50 uppercase mb-2">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="font-display text-[64px] leading-none text-black" style={{ letterSpacing: '-0.03em' }}>
                    {plan.price}
                  </span>
                  <span className="font-ui text-sm text-black/50 mb-2">{plan.period}</span>
                </div>
                <p className="font-ui text-sm text-black/70 leading-relaxed mt-2">{plan.description}</p>
              </div>
              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3" stroke="#E8714F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-ui text-sm text-black/80">{feat}</span>
                  </li>
                ))}
              </ul>
              {/* CTA */}
              <a
                href={`https://wa.me/212631604905?text=${encodeURIComponent(`Hi, I'm interested in the ${plan.name} plan.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  mt-auto text-center py-3.5 text-sm font-ui font-semibold uppercase tracking-[0.12em] transition-all
                  ${plan.ctaStyle === 'border'      ? 'border-rule text-black/70 hover:text-black hover:bg-cream' : ''}
                  ${plan.ctaStyle === 'solid-green' ? 'bg-accent text-cream hover:bg-accent' : ''}
                  ${plan.ctaStyle === 'solid-white' ? 'bg-black text-cream hover:bg-black-light' : ''}
                `}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}