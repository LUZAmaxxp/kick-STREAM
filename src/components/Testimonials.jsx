import { motion } from 'framer-motion'

const QUOTES = [
  {
    text: "Cancelled Sky and BT the same week. Best decision I've made since supporting this lot in 1998. Picture is flawless.",
    name: 'Gary T.',
    club: 'Tottenham',
    location: 'Watford',
    bg: '#FAFAF8',
  },
  {
    text: "Thought it'd be complicated to set up. Took me four minutes. Four. My son was furious he didn't find it first.",
    name: 'Damian O.',
    club: 'Everton',
    location: 'Liverpool',
    bg: '#F5F3EE',
  },
  {
    text: "The latency on my old stream was killing me. Spoilers everywhere before the goals even loaded. Never again.",
    name: 'Marcus W.',
    club: 'Leeds United',
    location: 'Sheffield',
    bg: '#FAFAF8',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Testimonials() {
  return (
    <section className="py-28 px-6" style={{ backgroundColor: '#F5F3EE' }}>
      <div className="max-w-7xl mx-auto">

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-data text-black text-xs tracking-[0.25em] uppercase mb-4 opacity-60"
        >
          From the Terraces
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(40px,6vw,72px)] text-black mb-16 leading-none"
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
              className="relative editorial-box p-8"
              style={{ background: q.bg, boxShadow: '4px 4px 0px rgba(26, 26, 26, 0.15)' }}
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
                className="font-ui text-base text-black/80 leading-relaxed mb-8"
                style={{ fontStyle: 'italic' }}
              >
                {q.text}
              </p>

              {/* Attribution */}
              <div className="rule-top pt-5">
                <p className="font-data text-[11px] tracking-[0.18em] text-black/50 uppercase">
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
