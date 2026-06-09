import { motion } from 'framer-motion'

const QUOTES = [
  {
    text: "I mainly joined for football, but I've ended up using it every day. Setup was straightforward and everything worked as expected.",
    name: 'Verified Customer',
    club: 'Community Member',
    location: 'Verified User',
  },
  {
    text: "Works well on my Firestick and the channel selection is better than I expected.",
    name: 'Verified Customer',
    club: 'Community Member',
    location: 'Verified User',
  },
  {
    text: "Support replied quickly when I had a question and helped me get started the same day.",
    name: 'Verified Customer',
    club: 'Community Member',
    location: 'Verified User',
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
          What Our Customers Say
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
