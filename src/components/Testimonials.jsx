import { motion } from 'framer-motion'

const QUOTES = [
  {
    text: "I originally joined Kick-Stream just to secure a stable feed for the big international tournaments. The 4K clarity blew me away—there's absolutely zero lag, even on busy weekend matchdays when standard streams usually crash. It's easily the best upgrade I've made for my living room.",
    name: 'David M.',
    club: 'Community Member',
    location: 'Verified User',
    bg: '#FAFAF8',
  },
  {
    text: "Managing multiple streaming apps was costing my family a fortune every month. Kick-Stream simplified everything. We got all our international channels and movies running on our Firestick in less than ten minutes. Flawless service.",
    name: 'Elena R.',
    club: 'Community Member',
    location: 'Verified User',
    bg: '#F5F3EE',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Testimonials() {
  return (
    <section className="py-28 px-6" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-7xl mx-auto">

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-data text-cream/70 text-xs tracking-[0.25em] uppercase mb-4"
        >
          From the Terraces
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(40px,6vw,72px)] text-cream mb-16 leading-none"
        >
          FANS DON'T LIE.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUOTES.map((q, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.13 }}
              className="relative bg-black/75 border border-border p-8 rounded-[28px]"
              style={{ boxShadow: '0 18px 48px rgba(0, 0, 0, 0.24)' }}
            >
              {/* Large opening quote */}
              <span
                className="block font-display leading-none text-accent mb-4 select-none"
                style={{ fontSize: '96px', lineHeight: '0.7', opacity: 0.5 }}
              >
                "
              </span>

              {/* Quote body */}
              <p
                className="font-ui text-base text-cream/85 leading-relaxed mb-8"
                style={{ fontStyle: 'italic' }}
              >
                {q.text}
              </p>

              {/* Attribution */}
              <div className="rule-top pt-5 border-t border-border/60">
                <p className="font-data text-[11px] tracking-[0.18em] text-cream/60 uppercase">
                  {q.name} — {q.club} Fan, {q.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
