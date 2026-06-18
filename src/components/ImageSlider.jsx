import { useState, useEffect } from 'react';

const slides = [
  {
    eyebrow: "Live Football",
    headline: "Every Match. Live.",
    accentWords: ["Live."],
    body: "Premier League, Champions League, La Liga, Serie A, Bundesliga, FA Cup, and more — streamed in flawless quality. High-priority routing keeps your feed stable when public servers buckle under global demand.",
    ctaText: "Get Your Pass",
    imageSrc: "/images/live1.jpg",
    imageAlt: "Live football match in a packed stadium",
    isLive: true
  },
  {
    eyebrow: "Device Compatibility",
    headline: "Any Screen. Instant Setup.",
    accentWords: ["Instant", "Setup."],
    body: "Smart TVs, Amazon Firestick, Android TV, iPhone, iPad, Windows PCs, and Mac computers — all fully supported. Most people are up and running in under five minutes with no technical experience needed.",
    ctaText: "Get Your Pass",
    imageSrc: "/images/compatibility.png",
    imageAlt: "Multiple screens showing StreamPITV on different devices",
    isLive: false
  },
  {
    eyebrow: "Movies & Series",
    headline: "Beyond Sport.",
    accentWords: ["Sport."],
    body: "Recent releases, full series seasons, documentaries, UK and US news, and kids content. Over 20,000 international channels from the US, UK, Europe, and Arabic regions — all accessible from one account.",
    ctaText: "Get Your Pass",
    imageSrc: "/images/sipderman.png",
    imageAlt: "Movie and TV content library on a smart TV",
    isLive: false
  }
];

export default function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = (n) => {
    setCurrentSlide((n + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      goTo(currentSlide + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide, isPaused]);

  const slide = slides[currentSlide];

  const renderHeadline = (text, accents) => {
    let result = text;
    accents.forEach(word => {
      result = result.replace(word, `<span style="color: var(--ks-gold)">${word}</span>`);
    });
    return <h2 className="ks-slider__headline" dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <section className="ks-slider-section">
      <style>{`
        .ks-slider-section {
          background: var(--ks-bg-alt);
          padding: 80px 0;
          overflow: hidden;
        }
        .ks-slider__label {
          font-family: var(--ks-font-ui);
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ks-gold);
          text-align: center;
          margin-bottom: 48px;
          display: block;
        }
        .ks-slider__container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .ks-slider__card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid var(--ks-border);
          border-radius: 10px;
          overflow: hidden;
          min-height: 400px;
          background: var(--ks-bg);
          animation: ks-fade-in 0.4s ease-out;
        }
        @keyframes ks-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ks-slider__left {
          background: var(--ks-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid var(--ks-border);
          position: relative;
          min-height: 400px;
        }
        .ks-slider__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ks-slider__placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--ks-text-muted);
        }
        .ks-slider__right {
          padding: 48px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--ks-bg);
        }
        .ks-slider__eyebrow {
          font-family: var(--ks-font-ui);
          font-weight: 500;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ks-gold);
          margin-bottom: 12px;
        }
        .ks-slider__headline {
          font-family: var(--ks-font-display);
          font-size: 42px;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: var(--ks-text);
          margin-bottom: 16px;
        }
        .ks-slider__body {
          font-family: var(--ks-font-ui);
          font-weight: 400;
          font-size: 14px;
          line-height: 1.75;
          color: var(--ks-text-muted);
          margin-bottom: 28px;
        }
        .ks-slider__cta {
          background: var(--ks-gold);
          color: var(--ks-bg);
          border: none;
          border-radius: 5px;
          padding: 11px 24px;
          font-family: var(--ks-font-ui);
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          width: fit-content;
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.2s;
        }
        .ks-slider__cta:hover {
          opacity: 0.9;
        }
        .ks-slider__live-chip {
          border: 1px solid rgba(93,186,133,0.3);
          border-radius: 100px;
          padding: 4px 12px;
          font-family: var(--ks-font-ui);
          font-weight: 500;
          font-size: 10px;
          color: var(--ks-green);
          margin-bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
        }
        .ks-slider__live-dot {
          width: 6px;
          height: 6px;
          background: var(--ks-green);
          border-radius: 50%;
          animation: ks-pulse 1.5s infinite;
        }
        @keyframes ks-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        .ks-slider__controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
        .ks-slider__dots {
          display: flex;
          gap: 8px;
        }
        .ks-slider__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--ks-border);
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ks-slider__dot--active {
          background: var(--ks-gold);
          width: 22px;
          border-radius: 3px;
        }
        .ks-slider__count {
          font-family: var(--ks-font-ui);
          font-weight: 400;
          font-size: 11px;
          color: var(--ks-text-ghost);
          letter-spacing: 0.06em;
        }
        .ks-slider__arrows {
          display: flex;
          gap: 8px;
        }
        .ks-slider__arrow {
          width: 36px;
          height: 36px;
          border: 1px solid var(--ks-border);
          border-radius: 5px;
          background: transparent;
          color: var(--ks-text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .ks-slider__arrow:hover {
          border-color: var(--ks-gold);
          color: var(--ks-gold);
        }
        
        @media (max-width: 767px) {
          .ks-slider__card {
            grid-template-columns: 1fr;
          }
          .ks-slider__left {
            border-right: none;
            border-bottom: 1px solid var(--ks-border);
            min-height: 220px;
            height: 220px;
          }
          .ks-slider__right {
            padding: 32px 24px;
          }
          .ks-slider__headline {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="ks-slider__container">
        <span className="ks-slider__label">Why StreamPITV</span>
        
        <div 
          key={currentSlide}
          className="ks-slider__card"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="ks-slider__left">
            {slide.imageSrc ? (
              <img 
                src={slide.imageSrc} 
                alt={slide.imageAlt} 
                className="ks-slider__img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="ks-slider__placeholder" style={{ display: slide.imageSrc ? 'none' : 'flex' }}>
              <i className="ti ti-photo" style={{ fontSize: '48px', color: 'var(--ks-border)' }}></i>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{slide.eyebrow}</span>
            </div>
          </div>

          <div className="ks-slider__right">
            {slide.isLive && (
              <div className="ks-slider__live-chip">
                <div className="ks-slider__live-dot"></div>
                LIVE
              </div>
            )}
            <span className="ks-slider__eyebrow">{slide.eyebrow}</span>
            {renderHeadline(slide.headline, slide.accentWords)}
            <p className="ks-slider__body">{slide.body}</p>
            <a href="#pricing" className="ks-slider__cta">{slide.ctaText}</a>
          </div>
        </div>

        <div className="ks-slider__controls">
          <div className="ks-slider__dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`ks-slider__dot ${currentSlide === i ? 'ks-slider__dot--active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="ks-slider__count">
            {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </div>

          <div className="ks-slider__arrows">
            <button className="ks-slider__arrow" onClick={() => goTo(currentSlide - 1)} aria-label="Previous slide">
              <i className="ti ti-arrow-left"></i>
            </button>
            <button className="ks-slider__arrow" onClick={() => goTo(currentSlide + 1)} aria-label="Next slide">
              <i className="ti ti-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
