import { motion } from 'framer-motion'

const STEPS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
        <path d="M10 10l4 4m0-4l-4 4" className="opacity-40" />
      </svg>
    ),
    headline: 'Everything in One Place',
    body: "Stop juggling multiple expensive subscriptions just to watch your favourite teams and shows. Live football, major sports, movies, series, news, and international channels — all consolidated into a single, easy-to-use interface. No switching between apps, no extra costs.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 8l5 3-5 3V8z" fill="currentColor" className="text-accent/20" />
        <rect x="15" y="12" width="7" height="10" rx="1" className="fill-black" />
        <path d="M18 15v4" />
      </svg>
    ),
    headline: 'Simple Setup on Any Device',
    body: "Most people are up and running in just a few minutes. Works on Smart TVs, Amazon Firestick, Android TV Boxes, Android phones and tablets, iPhone and iPad, Windows PCs, and Mac computers. If you're not sure whether your device is supported, get in touch and we'll check for you.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
    headline: 'Friendly Support When You Need It',
    body: "Your access credentials and a simple step-by-step setup guide land in your inbox within 10 to 30 minutes of purchase. Our support team replies quickly and helps you get started the same day — no technical background required.",
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
          className="font-display text-[clamp(40px,6vw,72px)] text-cream mb-4 leading-none"
        >
          Why People Stay With Us
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-ui text-sm text-cream/70 mb-16 max-w-2xl"
        >
          Many people come looking for football or a specific sports event, but over time they end up using the service every day.
        </motion.p>

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
