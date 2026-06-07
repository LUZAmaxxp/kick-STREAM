import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const SLOGANS = [
  {
    id: 1,
    phrase: 'The Entire World of Live Entertainment.',
    accents: ['Entertainment'],
    accentWordIndexes: [5],
  },
  {
    id: 2,
    phrase: 'Curated For Your Screen.',
    accents: ['Your', 'Screen'],
    accentWordIndexes: [2, 3],
  },
];

const SWITCH_EVERY_MS = 4000;

const phraseVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.35, ease: 'easeIn' },
  },
};

function renderAccentPhrase(phrase, accents = [], accentWordIndexes = []) {
  const words = phrase.split(' ');
  return words.map((word, idx) => {
    const cleanWord = word.replace(/[^A-Za-z]/g, '');
    const isAccent = accentWordIndexes.includes(idx) || accents.includes(cleanWord);
    const key = `${cleanWord}-${idx}`;
    return (
      <span key={key} className={isAccent ? 'hero-slogan__accent' : undefined}>
        {word}
        {idx < words.length - 1 ? ' ' : ''}
      </span>
    );
  });
}

export default function HeroSlogans() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlogan = useMemo(() => {
    if (activeIndex < 0 || activeIndex >= SLOGANS.length) return null;
    return SLOGANS[activeIndex];
  }, [activeIndex]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLOGANS.length);
    }, SWITCH_EVERY_MS);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <div aria-label="Animated slogan reveal sequence">
      <div style={{ minHeight: 'clamp(72px, 10vw, 130px)' }}>
        <AnimatePresence mode="wait">
          {activeSlogan && (
            <motion.h1
              key={activeSlogan.id}
              className="font-display text-[clamp(56px,11vw,144px)] leading-[0.92] text-cream max-w-3xl"
              style={{ letterSpacing: '-0.02em' }}
              initial={prefersReducedMotion ? false : 'initial'}
              animate={prefersReducedMotion ? false : 'animate'}
              exit={prefersReducedMotion ? undefined : 'exit'}
              variants={phraseVariants}
            >
              {renderAccentPhrase(activeSlogan.phrase, activeSlogan.accents, activeSlogan.accentWordIndexes)}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
