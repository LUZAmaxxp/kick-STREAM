import { motion } from 'framer-motion'

const QUOTES = [
  {
    text: "Cancelled Sky and BT the same week. Best decision I've made since supporting this lot in 1998. Picture is flawless.",
    name: 'Gary T.',
    club: 'Tottenham',
    location: 'Watford',
    bg: '#111213',
  },
  {
    text: "Thought it'd be complicated to set up. Took me four minutes. Four. My son was furious he didn't find it first.",
    name: 'Damian O.',
    club: 'Everton',
    location: 'Liverpool',
    bg: '#141415',
  },
  {
    text: "The latency on my old stream was killing me. Spoilers everywhere before the goals even loaded. Never again.",
    name: 'Marcus W.',
    club: 'Leeds United',
    location: 'Sheffield',
    bg: '#111213',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-[#F5F3EE] border-b-2 border-[#1A1A1A]" style={{ borderRadius: 0 }}>
      <div className="max-w-7xl mx-auto">
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-mono text-[#00A651] text-xs tracking-[0.25em] uppercase mb-4"
        >
          From the Terraces
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-anton text-[clamp(40px,6vw,72px)] text-[#1A1A1A] mb-16 leading-none uppercase"
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
              className="relative p-8 border-2 border-[#1A1A1A]"
              style={{ background: '#FFF', borderRadius: 0 }}
            >
              {/* Large opening quote */}
              <span
                className="block font-anton leading-none text-[#00A651] mb-4 select-none"
                style={{ fontSize: '96px', lineHeight: '0.7', opacity: 0.7 }}
              >
                "
              </span>
              {/* Quote body */}
              <p
                className="font-dmsans text-base text-[#1A1A1A] leading-relaxed mb-8"
                style={{ fontStyle: 'italic' }}
              >
                {q.text}
              </p>
              {/* Attribution */}
              <div className="pt-5 border-t border-[#E4E1D8]">
                <p className="font-mono text-[11px] tracking-[0.18em] text-[#4A4A44] uppercase">
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
