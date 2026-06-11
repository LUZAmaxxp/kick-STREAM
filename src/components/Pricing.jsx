import { motion } from 'framer-motion'

const PLANS = [
  {
    id: 'one-month',
    name: '1 Month',
    price: '$14.99',
    period: '/month',
    description: 'Flexible short-term access with a fast entry point.',
    features: [
      'One-day free trial included',
      'Live match alerts and chat access',
      'Optimized streaming routes',
      'Real-time support ready',
    ],
    cta: 'Start 1-Day Trial',
    ctaStyle: 'border',
    popular: false,
  },
  {
    id: 'three-month',
    name: '3 Months',
    price: '$29.99',
    period: '/3 months',
    description: 'Best for fans who want consistent access without commitment.',
    features: [
      'One-day free trial included',
      'Live match alerts and chat access',
      'Optimized streaming routes',
      'Priority support access',
    ],
    cta: 'Start 1-Day Trial',
    ctaStyle: 'solid-white',
    popular: true,
  },
  {
    id: 'six-month',
    name: '6 Months',
    price: '$49.99',
    period: '/6 months',
    description: 'Half-year plan for serious fans who settle in for the season.',
    features: [
      'One-day free trial included',
      'Live match alerts and chat access',
      'Optimized streaming routes',
      'Priority support access',
      'Stream reliability monitoring',
    ],
    cta: 'Start 1-Day Trial',
    ctaStyle: 'solid-green',
    popular: false,
  },
  {
    id: 'twelve-month',
    name: '12 Months',
    price: '$69.99',
    period: '/12 months',
    description: 'Best value package for year-round access and peace of mind.',
    features: [
      'One-day free trial included',
      'Live match alerts and chat access',
      'Optimized streaming routes',
      'Priority support access',
      'Stream reliability monitoring',
      'Annual value pricing',
    ],
    cta: 'Start 1-Day Trial',
    ctaStyle: 'solid-green',
    popular: false,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-7xl mx-auto">

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-data text-cream/70 text-xs tracking-[0.25em] uppercase mb-4"
        >
          Pricing
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(40px,6vw,72px)] text-cream mb-4 leading-none"
        >
          Invest in Better Entertainment
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-ui text-sm text-cream/70 mb-16 max-w-md"
        >
          Every plan includes a 1-day free trial. No blackouts. No upsells.
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
              className={`relative bg-black/75 border border-border p-8 rounded-[30px] flex flex-col gap-6 ${plan.popular ? 'md:-translate-y-4' : ''}`}
              style={{ boxShadow: plan.popular ? '0 20px 60px rgba(0,0,0,0.35)' : '0 12px 36px rgba(0,0,0,0.25)' }}
            >
              {/* MOST POPULAR badge */}
              {plan.popular && (
                <div className="absolute -top-4 right-6 bg-accent text-black font-data text-[10px] tracking-[0.2em] uppercase px-3 py-1 font-semibold border border-border">
                  MOST POPULAR
                </div>
              )}

              {/* Plan name */}
              <div>
                <p className="font-data text-[11px] tracking-[0.2em] text-cream/70 uppercase mb-2">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="font-display text-[64px] leading-none text-cream" style={{ letterSpacing: '-0.03em' }}>
                    {plan.price}
                  </span>
                  <span className="font-ui text-sm text-cream/70 mb-2">{plan.period}</span>
                </div>
                <p className="font-ui text-sm text-cream/70 leading-relaxed mt-2">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-accent">
                      <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-ui text-sm text-cream/85">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={`https://wa.me/18582525266?text=${encodeURIComponent(`Hello, I am interested in the ${plan.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto text-center py-3.5 text-sm font-ui font-semibold uppercase tracking-[0.12em] transition-all bg-accent text-black hover:bg-accent/90"
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
