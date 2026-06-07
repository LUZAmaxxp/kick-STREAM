import { motion } from 'framer-motion'

const STEPS = [
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-[5.5rem] h-[5.5rem]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 24l16-12 16 12v12a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V24z" />
        <path d="M16 24l16 22 16-22" />
        <path d="M24 24l8-8 8 8" />
      </svg>
    ),
    headline: 'Premium Quality Without the Monopoly Markups',
    body: "We believe you shouldn't have to pay massive corporate cable bills just to enjoy world-class entertainment. By bypassing traditional middlemen and managing high-bandwidth server pathways directly to your screen, we deliver a genuinely luxurious, elite viewing experience at a highly accessible, smart price point.",
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-[5.5rem] h-[5.5rem]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 12v40" />
        <path d="M20 20l24 12-24 12" />
      </svg>
    ),
    headline: 'The End of the Buffering Wheel',
    body: "There is nothing worse than your screen freezing right as a historic play is about to happen. Kick-Stream is engineered on an advanced H265 anti-freeze server matrix built to withstand global traffic surges. With an industry-leading 99.9% uptime record, your picture stays razor-sharp and fluid while everyone else is left staring at a loading icon.",
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-[5.5rem] h-[5.5rem]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="32" r="18" />
        <path d="M14 32h36" />
        <path d="M32 14v36" />
        <path d="M20 18c8 4 16 4 24 0" />
        <path d="M20 46c8-4 16-4 24 0" />
      </svg>
    ),
    headline: 'One Account. Complete Freedom.',
    body: "Stop juggling five different expensive, confusing streaming subscriptions just to watch your favorite teams and shows. We consolidate the world's finest sports, cinema, and news networks into a single, beautifully organized, high-speed interface that puts you completely in control of your entertainment.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HowItWorks() {
  return (
    <section id="why-us" className="py-28 px-6" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-data text-cream/70 text-xs tracking-[0.25em] uppercase mb-4"
        >
          Why Choose Us
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(40px,6vw,72px)] text-cream mb-16 leading-none"
        >
          Built to Protect Your Evenings
        </motion.h2>

        {/* Steps (Why Us items) */}
        <div className="relative flex flex-col md:flex-row items-start gap-0 md:gap-0">

          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col md:flex-row flex-1 items-start md:items-stretch">
              {/* Step card */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15 }}
                className="flex-1 flex flex-col gap-4 px-0 md:px-8 py-6 md:py-0"
              >
                {/* Step icon/number */}
                <span
                  className="inline-flex items-center justify-center w-[5.5rem] h-[5.5rem]"
                  style={{ color: 'rgba(183, 158, 79, 0.12)', letterSpacing: '-0.04em' }}
                >
                  {step.icon}
                </span>

                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-cream tracking-wider mb-2">
                    {step.headline}
                  </h3>
                  <p className="font-ui text-sm text-cream/70 leading-relaxed max-w-xs">
                    {step.body}
                  </p>
                </div>
              </motion.div>

              {/* Connector — hidden after last step */}
              {i < STEPS.length - 1 && (
                <div className="flex flex-col md:flex-row items-center justify-center px-0 md:px-2 py-0 md:py-12">
                  {/* Vertical on mobile */}
                  <div
                    className="block md:hidden w-px h-12 ml-[2px] mt-1"
                    style={{ background: 'repeating-linear-gradient(to bottom, rgba(26,26,26,0.4) 0px, rgba(26,26,26,0.4) 4px, transparent 4px, transparent 10px)' }}
                  />
                  {/* Horizontal on desktop */}
                  <div
                    className="hidden md:block h-px w-12 flex-shrink-0"
                    style={{ background: 'repeating-linear-gradient(to right, rgba(26,26,26,0.4) 0px, rgba(26,26,26,0.4) 4px, transparent 4px, transparent 10px)' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
