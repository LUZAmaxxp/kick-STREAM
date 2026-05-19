import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    headline: 'CHOOSE YOUR PLAN',
    body: 'Pick the tier that fits your match schedule. Monthly, annual, or multi-device — no hidden fees.',
  },
  {
    num: '02',
    headline: 'RECEIVE YOUR KIT',
    body: 'Your dedicated server and pre-loaded firmware kit ships within 48 hours. Tracked delivery, no faff.',
  },
  {
    num: '03',
    headline: 'PLUG IN. KICK OFF.',
    body: 'Power on, connect, stream. Never miss another opening whistle. Your server, your signal, forever.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-mono text-green text-xs tracking-[0.25em] uppercase mb-4"
        >
          How It Works
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(40px,6vw,72px)] text-snow mb-16 leading-none"
        >
          THREE STEPS TO EVERY MATCH.
        </motion.h2>

        {/* Steps */}
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
                {/* Step number */}
                <span
                  className="font-display text-[80px] md:text-[96px] leading-none"
                  style={{ color: 'rgba(170,255,69,0.15)', letterSpacing: '-0.04em' }}
                >
                  {step.num}
                </span>

                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-snow tracking-wider mb-2">
                    {step.headline}
                  </h3>
                  <p className="font-body text-sm text-snow/50 leading-relaxed max-w-xs">
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
                    style={{ background: 'repeating-linear-gradient(to bottom, rgba(170,255,69,0.5) 0px, rgba(170,255,69,0.5) 4px, transparent 4px, transparent 10px)' }}
                  />
                  {/* Horizontal on desktop */}
                  <div
                    className="hidden md:block h-px w-12 flex-shrink-0"
                    style={{ background: 'repeating-linear-gradient(to right, rgba(170,255,69,0.5) 0px, rgba(170,255,69,0.5) 4px, transparent 4px, transparent 10px)' }}
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
