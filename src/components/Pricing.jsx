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

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-[#F5F3EE] border-b-2 border-[#1A1A1A]" style={{ borderRadius: 0 }}>
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[#00A651] text-xs tracking-[0.25em] uppercase mb-4"
        >
          Pricing
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-anton text-[clamp(40px,6vw,72px)] text-[#1A1A1A] mb-4 leading-none uppercase"
        >
          ONE PRICE. EVERY MATCH.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-dmsans text-sm text-[#4A4A44] mb-16 max-w-md"
        >
          No blackouts. No upsells. No broadcaster telling you which games you're allowed to watch.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12 }}
              className={`relative p-8 flex flex-col gap-6 border-2 border-[#1A1A1A] bg-[#FFF]`}
              style={{ borderRadius: 0 }}
            >
              {/* MOST POPULAR badge */}
              {plan.popular && (
                <div className="absolute -top-3 right-6 bg-[#00A651] text-[#F5F3EE] font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 font-semibold" style={{ borderRadius: 0 }}>
                  MOST POPULAR
                </div>
              )}
              {/* Plan name */}
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-[#4A4A44] uppercase mb-2">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="font-anton text-[64px] leading-none text-[#1A1A1A]" style={{ letterSpacing: '-0.03em' }}>
                    {plan.price}
                  </span>
                  <span className="font-dmsans text-sm text-[#4A4A44] mb-2">{plan.period}</span>
                </div>
                <p className="font-dmsans text-sm text-[#4A4A44] leading-relaxed mt-2">{plan.description}</p>
              </div>
              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3" stroke="#00A651" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-dmsans text-sm text-[#1A1A1A]">{feat}</span>
                  </li>
                ))}
              </ul>
              {/* CTA */}
              <a
                href={`https://wa.me/212631604905?text=Hi%2C%20I%20want%20to%20buy%20the%20${encodeURIComponent(plan.name)}%20plan`}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics={`plan-cta-${plan.id}`}
                className={`mt-auto text-center py-3.5 text-[15px] font-anton font-semibold uppercase tracking-[0.12em] transition-all border-2 border-[#1A1A1A] rounded-none bg-[#FFF] text-[#1A1A1A] hover:bg-[#00A651] hover:text-[#F5F3EE]`}
                style={{ borderRadius: 0 }}
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
