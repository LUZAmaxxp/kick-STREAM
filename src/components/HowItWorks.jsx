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
    <section id="how-it-works" className="py-24 px-6 bg-[#FFF] border-b-2 border-[#1A1A1A]" style={{ borderRadius: 0 }}>
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-mono text-[#00A651] text-xs tracking-[0.25em] uppercase mb-4"
        >
          How It Works
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-anton text-[clamp(40px,6vw,72px)] text-[#1A1A1A] mb-16 leading-none uppercase"
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
                  className="font-anton text-[80px] md:text-[96px] leading-none text-[#E4E1D8]"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  {step.num}
                </span>
                <div>
                  <h3 className="font-anton text-2xl md:text-3xl text-[#1A1A1A] tracking-tight mb-2 uppercase">
                    {step.headline}
                  </h3>
                  <p className="font-dmsans text-[15px] text-[#4A4A44] leading-relaxed max-w-xs">
                    {step.body}
                  </p>
                </div>
              </motion.div>
              {/* Connector — hidden after last step */}
              {i < STEPS.length - 1 && (
                <div className="flex flex-col md:flex-row items-center justify-center px-0 md:px-2 py-0 md:py-12">
                  {/* Vertical on mobile */}
                  <div
                    className="block md:hidden w-px h-12 ml-[2px] mt-1 bg-[#1A1A1A]"
                  />
                  {/* Horizontal on desktop */}
                  <div
                    className="hidden md:block h-px w-12 flex-shrink-0 bg-[#1A1A1A]"
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
