import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUESTIONS = [
  {
    q: 'Do I need technical skills?',
    a: 'None whatsoever. The firmware kit arrives pre-configured. Plug it into your router, power it on, log into your account. That\'s it. If you can turn on a TV, you can use KickStream.',
  },
  {
    q: 'Is this legal and licensed?',
    a: 'Yes. KickStream holds broadcast rights for all covered competitions in the UK. You\'re not pirating anything — you\'re using a legitimately licensed service that actually respects its customers.',
  },
  {
    q: 'What football competitions are covered?',
    a: 'All 380 Premier League fixtures per season, the full FA Cup from Round 1, the Carabao Cup, and Championship play-offs. International tournaments (Euros, World Cup qualifying) covered on Boardroom tier.',
  },
  {
    q: 'How fast is shipping?',
    a: 'Your server and firmware kit ships within 48 hours of purchase, tracked delivery via DHL. Most UK mainland customers receive it next-day. Northern Ireland, Scotland Highlands: add one day.',
  },
  {
    q: 'What happens if my server has issues?',
    a: 'We send a replacement within 24 hours, no questions asked. While you wait, your account is temporarily moved to our shared streaming infrastructure so you don\'t miss a match.',
  },
]

function AccordionItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null)
  return (
    <div className="border-b" style={{ borderColor: 'rgba(26,26,26,0.1)' }}>
      <button
        className="w-full flex items-center justify-between py-6 text-left group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-ui text-base md:text-lg text-black/80 group-hover:text-black transition-colors pr-8">
          {item.q}
        </span>
        <span
          className="flex-shrink-0 w-8 h-8 border flex items-center justify-center text-accent transition-all"
          style={{ borderColor: 'rgba(232, 113, 79, 0.3)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="#E8714F" strokeWidth="1.6" strokeLinecap="round"/>
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
            <p className="font-ui text-sm text-black/60 leading-relaxed pb-6 max-w-2xl">
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
    <section id="faq" className="py-28 px-6" style={{ backgroundColor: '#F5F3EE' }}>
      <div className="max-w-3xl mx-auto">

        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="font-data text-black text-xs tracking-[0.25em] uppercase mb-4 opacity-60"
        >
          FAQ
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(40px,6vw,72px)] text-black mb-16 leading-none"
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
