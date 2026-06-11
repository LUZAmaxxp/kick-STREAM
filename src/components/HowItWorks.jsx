import { motion } from 'framer-motion'

const STEPS = [
  {
    icon: (
      // All content converging into one screen
      <svg viewBox="0 0 56 56" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="14" width="40" height="26" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="11" y="17" width="34" height="20" rx="1.5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.8"/>
        <circle cx="28" cy="27" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
        <line x1="13" y1="19" x2="25.2" y2="25.2" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="43" y1="19" x2="30.8" y2="25.2" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="13" y1="35" x2="25.2" y2="28.8" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="43" y1="35" x2="30.8" y2="28.8" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="13" cy="19" r="1.6" fill="currentColor" fillOpacity="0.8"/>
        <circle cx="43" cy="19" r="1.6" fill="currentColor" fillOpacity="0.8"/>
        <circle cx="13" cy="35" r="1.6" fill="currentColor" fillOpacity="0.8"/>
        <circle cx="43" cy="35" r="1.6" fill="currentColor" fillOpacity="0.8"/>
        <line x1="28" y1="40" x2="28" y2="44" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="22" y1="44" x2="34" y2="44" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    headline: 'Everything in One Place',
    body: "Stop juggling multiple expensive subscriptions just to watch your favourite teams and shows. Live football, major sports, movies, series, news, and international channels — all consolidated into a single, easy-to-use interface. No switching between apps, no extra costs.",
  },
  {
   icon: (
      // TV + tablet + phone in harmony
      <svg viewBox="0 0 56 56" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="17" width="22" height="15" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <line x1="15" y1="32" x2="15" y2="35" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="35" x2="19" y2="35" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 22l6 3-6 3V22z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1" strokeLinejoin="round"/>
        <rect x="29" y="14" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="36" cy="32" r="1.2" fill="currentColor" fillOpacity="0.7"/>
        <line x1="32" y1="18" x2="40" y2="18" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round"/>
        <line x1="32" y1="21" x2="40" y2="21" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round"/>
        <rect x="45" y="19" width="8" height="14" rx="1.5" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.5"/>
        <circle cx="49" cy="31" r="1" fill="currentColor" fillOpacity="0.6"/>
        <path d="M8 13 Q28 8 50 13" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 3"/>
      </svg>
    ),
    
    headline: 'Simple Setup on Any Device',
    body: "Most people are up and running in just a few minutes. Works on Smart TVs, Amazon Firestick, Android TV Boxes, Android phones and tablets, iPhone and iPad, Windows PCs, and Mac computers. If you're not sure whether your device is supported, get in touch and we'll check for you.",
  },
  {
    icon: (
      // Headset with mic — friendly human support
      <svg viewBox="0 0 56 56" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 28 Q14 16 28 16 Q42 16 42 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="10" y="27" width="7" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
        <rect x="39" y="27" width="7" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
        <path d="M43 38 Q43 43 38 43" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="38" cy="43" r="1.8" fill="currentColor" fillOpacity="0.9"/>
        <circle cx="28" cy="28" r="2.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1"/>
        <path d="M22 36 Q28 40 34 36" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round"/>
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
          className="font-data text-accent text-xs tracking-[0.25em] uppercase mb-4"
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
                className="flex-1 flex flex-col gap-6 px-0 md:px-8 py-8 md:py-0"
              >
                {/* Step icon container */}
                <div className="relative group w-16 h-16">
                  {/* Subtle glow */}
                  <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon Box */}
                  <div 
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center border border-accent/20 bg-accent/5 text-accent transition-all duration-300 group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:scale-105"
                  >
                    {step.icon}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-cream tracking-wider mb-3">
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
                    className="block md:hidden w-px h-12 ml-[31px]"
                    style={{ background: 'repeating-linear-gradient(to bottom, rgba(183,158,79,0.2) 0px, rgba(183,158,79,0.2) 4px, transparent 4px, transparent 10px)' }}
                  />
                  {/* Horizontal on desktop */}
                  <div
                    className="hidden md:block h-px w-12 flex-shrink-0 mt-8"
                    style={{ background: 'repeating-linear-gradient(to right, rgba(183,158,79,0.2) 0px, rgba(183,158,79,0.2) 4px, transparent 4px, transparent 10px)' }}
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
