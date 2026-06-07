import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUESTIONS = [
  {
    q: 'Will my stream freeze during major, high-demand championship games?',
    a: 'No. While standard providers overload their systems, Kick-Stream invests in premium, load-balanced edge servers. When millions of viewers log on simultaneously for a massive sports final, our system dynamically scales your connection to ensure your feed remains smooth, clear, and uninterrupted.',
  },
  {
    q: 'Can I easily find specific international networks and sports leagues?',
    a: 'Absolutely. Our system is built with user experience in mind. The library is cleanly categorized by country and genre, featuring dedicated, lightning-fast sections for global football, basketball, premium cinema, and live broadcasts.',
  },
  {
    q: 'I\'m not great with technology. How difficult is the installation process?',
    a: 'It is entirely stress-free. You don\'t need any technical background whatsoever. Your private access credentials along with a simple, visual step-by-step guide will land in your inbox within 10 to 30 minutes of purchase, and our team is right here to guide you if you want a helping hand.',
  },
]

function AccordionItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null)

  return (
    <div className="border-b" style={{ borderColor: 'rgba(183, 158, 79, 0.12)' }}>
      <button
        className="w-full flex items-center justify-between py-6 text-left group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-ui text-base md:text-lg text-cream/90 group-hover:text-accent transition-colors pr-8">
          {item.q}
        </span>
        <span
          className="flex-shrink-0 w-8 h-8 border flex items-center justify-center text-accent transition-all"
          style={{ borderColor: 'rgba(183, 158, 79, 0.3)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="font-ui text-sm text-cream/70 leading-relaxed pb-6 max-w-2xl">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i)

  return (
    <section id="faq" className="py-28 px-6" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="max-w-3xl mx-auto">

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-data text-cream/70 text-xs tracking-[0.25em] uppercase mb-4"
        >
          FAQ
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(40px,6vw,72px)] text-cream mb-16 leading-none"
        >
          STRAIGHT ANSWERS.
        </motion.h2>

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {QUESTIONS.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
