import { useState, useEffect, useRef } from 'react';
import videoBg from '../assets/13406407_1080_1920_30fps.mp4';
import { useNavigate } from 'react-router-dom';

const TICKER_ITEMS = [
  'Welcome back', 'Sign in to continue', 'New here? Join us',
  'Your journey starts now', 'Welcome back', 'Sign in to continue',
  'New here? Join us', 'Your journey starts now',
];

// const PHOTO_URL =
//   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80';

export default function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const btnRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubmitted(true);
    try {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(isLogin ? { email, password } : { email, password, username: email.split('@')[0] }),
          credentials: 'include',
        });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || 'Authentication failed');
        setSubmitted(false);
        return;
      }
        // Assume backend sets cookie; just update user state
        onAuth(data.user);
      navigate('/');
    } catch (err) {
      setError('Server error. Please try again.');
      setSubmitted(false);
    }
  };

  const switchMode = () => {
    setIsLogin((v) => !v);
    setError('');
    setSubmitted(false);
  };

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* ── LEFT PANEL ── */}
      <div style={s.left}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            ...s.photoBg,
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
          }}
          src={videoBg}
        />
        <div style={s.leftOverlay} />

        {/* Ticker */}
        <div style={s.ticker}>
          <div className="ticker-inner">
            {TICKER_ITEMS.map((t, i) => (
              <span key={i} style={s.tickerItem}>
                {t}
                <span style={s.tickerDot}>◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* Rotated badge */}
        <div style={s.badge} className="badge-pulse">SINCE 2024</div>

        {/* Bottom copy */}
        <div style={s.leftContent}>
          <div style={s.accentBar} />
          <p style={s.bigLabel}>
            Make it<br />
            <span style={s.bigLabelOrange}>count.</span>
          </p>
          <p style={s.subLabel}>
            Every great thing starts with a single step. Yours is right here.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={s.right}>
        {/* Corner accents */}
        <div style={s.cornerTR} />
        <div style={s.cornerBL} />

        {/* Dot grid */}
        <div style={s.dotGrid}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={s.dot} />
          ))}
        </div>

        {/* Toggle */}
        <div style={s.modeToggle}>
          <button
            type="button"
            style={isLogin ? { ...s.modeBtn, ...s.modeBtnActive } : s.modeBtn}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={!isLogin ? { ...s.modeBtn, ...s.modeBtnActive } : s.modeBtn}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <div style={s.formHeader}>
          <h2 style={s.formTitle}>{isLogin ? 'Welcome back' : 'Join us today'}</h2>
          <p style={s.formSub}>
            {isLogin ? 'Enter your credentials to continue' : 'Create your account in seconds'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          {/* Email */}
          <div style={s.inputGroup}>
            <label style={s.inputLabel}>Email address</label>
            <div style={s.inputWrap}>
              <span style={{
                ...s.inputIcon,
                color: focused === 'email' ? '#FF6B00' : '#bbb',
              }}>✉</span>
              <input
                type="email"
                placeholder="you@example.com"
                style={{
                  ...s.input,
                  borderColor: focused === 'email' ? '#FF6B00' : '#1A1A1A',
                  boxShadow: focused === 'email' ? '3px 3px 0 #FF6B00' : 'none',
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div style={s.inputGroup}>
            <label style={s.inputLabel}>Password</label>
            <div style={s.inputWrap}>
              <span style={{
                ...s.inputIcon,
                color: focused === 'password' ? '#FF6B00' : '#bbb',
              }}>🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  ...s.input,
                  borderColor: focused === 'password' ? '#FF6B00' : '#1A1A1A',
                  boxShadow: focused === 'password' ? '3px 3px 0 #FF6B00' : 'none',
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
            </div>
          </div>

          {error && <div style={s.error}>{error}</div>}

          {/* Submit */}
          <button
            ref={btnRef}
            type="submit"
            className="submit-btn"
            style={{
              ...s.submitBtn,
              background: submitted ? '#FF6B00' : '#1A1A1A',
              color: submitted ? '#1A1A1A' : '#F5F3EE',
            }}
          >
            <span style={s.submitInner}>
              {submitted ? '✓ Done!' : isLogin ? 'Sign In →' : 'Create Account →'}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div style={s.divider}>
          <div style={s.divLine} />
          <span style={s.divText}>or</span>
          <div style={s.divLine} />
        </div>

        {/* Switch */}
        <p style={s.switchRow}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" style={s.switchLink} onClick={switchMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const s = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    background: '#F5F3EE',
    fontFamily: "'DM Sans', sans-serif",
    overflow: 'hidden',
    position: 'relative',
  },

  /* LEFT */
  left: {
    flex: '1.1',
    background: '#1A1A1A',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '40px',
  },
  photoBg: {
    position: 'absolute',
    inset: 0,
    // backgroundImage: `url('${PHOTO_URL}')`,
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    // opacity: 0.45,
  },
  leftOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(160deg, transparent 30%, #1A1A1A 85%)',
  },
  ticker: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    background: '#FF6B00',
    overflow: 'hidden',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
  },
  tickerItem: {
    fontFamily: "'Anton', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.18em',
    color: '#1A1A1A',
    textTransform: 'uppercase',
    padding: '0 20px',
    whiteSpace: 'nowrap',
  },
  tickerDot: { color: '#1A1A1A', opacity: 0.45, margin: '0 4px' },
  badge: {
    position: 'absolute',
    top: '56px',
    right: '-8px',
    background: '#FF6B00',
    color: '#1A1A1A',
    fontFamily: "'Anton', sans-serif",
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '5px 14px',
    transform: 'rotate(-90deg)',
    transformOrigin: 'right center',
  },
  leftContent: { position: 'relative', zIndex: 2 },
  accentBar: { width: '40px', height: '3px', background: '#FF6B00', marginBottom: '16px' },
  bigLabel: {
    fontFamily: "'Anton', sans-serif",
    fontSize: 'clamp(38px, 5vw, 58px)',
    lineHeight: 1,
    color: '#F5F3EE',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  bigLabelOrange: { color: '#FF6B00' },
  subLabel: {
    fontSize: '13px',
    color: 'rgba(245,243,238,0.55)',
    letterSpacing: '0.05em',
    maxWidth: '220px',
    lineHeight: 1.65,
  },

  /* RIGHT */
  right: {
    flex: '0.9',
    background: '#F5F3EE',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '48px 44px',
    position: 'relative',
  },
  cornerTR: {
    position: 'absolute', top: 20, right: 20,
    width: 28, height: 28,
    borderTop: '2px solid #1A1A1A',
    borderRight: '2px solid #1A1A1A',
  },
  cornerBL: {
    position: 'absolute', bottom: 20, left: 20,
    width: 28, height: 28,
    borderBottom: '2px solid #FF6B00',
    borderLeft: '2px solid #FF6B00',
  },
  dotGrid: {
    position: 'absolute', bottom: 46, right: 40,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 6px)',
    gridTemplateRows: 'repeat(4, 6px)',
    gap: '4px',
    opacity: 0.15,
  },
  dot: { width: '3px', height: '3px', background: '#1A1A1A', borderRadius: '50%' },

  modeToggle: {
    display: 'flex',
    background: '#E8E5DE',
    padding: '3px',
    gap: '3px',
    width: 'fit-content',
    marginBottom: '28px',
  },
  modeBtn: {
    fontFamily: "'Anton', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '7px 22px',
    border: 'none',
    background: 'transparent',
    color: '#999',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    borderRadius: 0,
  },
  modeBtnActive: { background: '#1A1A1A', color: '#F5F3EE' },

  formHeader: { marginBottom: '28px' },
  formTitle: {
    fontFamily: "'Anton', sans-serif",
    fontSize: '34px',
    color: '#1A1A1A',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    lineHeight: 1,
    marginBottom: '6px',
    fontWeight: 400,
  },
  formSub: { fontSize: '12px', color: '#999', letterSpacing: '0.04em' },

  form: { display: 'flex', flexDirection: 'column', gap: 0 },

  inputGroup: { marginBottom: '14px' },
  inputLabel: {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#888',
    fontWeight: 500,
    marginBottom: '5px',
  },
  inputWrap: { position: 'relative' },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
    pointerEvents: 'none',
    transition: 'color 0.2s',
    lineHeight: 1,
  },
  input: {
    width: '100%',
    border: '1.5px solid #1A1A1A',
    background: '#fff',
    padding: '11px 14px 11px 38px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#1A1A1A',
    borderRadius: 0,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  error: {
    fontSize: '11px',
    color: '#cc2200',
    letterSpacing: '0.04em',
    marginBottom: '10px',
    marginTop: '-4px',
  },

  submitBtn: {
    width: '100%',
    border: 'none',
    fontFamily: "'Anton', sans-serif",
    fontSize: '13px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    padding: '13px 0',
    cursor: 'pointer',
    borderRadius: 0,
    marginTop: '6px',
    transition: 'background 0.25s, color 0.25s',
    position: 'relative',
    overflow: 'hidden',
  },
  submitInner: { position: 'relative', zIndex: 1 },

  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0' },
  divLine: { flex: 1, height: '1px', background: '#D8D5CE' },
  divText: { fontSize: '11px', color: '#aaa', letterSpacing: '0.08em' },

  switchRow: { textAlign: 'center', fontSize: '12px', color: '#888' },
  switchLink: {
    color: '#FF6B00',
    fontWeight: 500,
    textDecoration: 'underline',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontFamily: 'inherit',
    fontSize: '12px',
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500&display=swap');

  .photo-zoom {
    animation: slowZoom 18s ease-in-out infinite alternate;
  }
  @keyframes slowZoom {
    from { transform: scale(1); }
    to   { transform: scale(1.08); }
  }

  .ticker-inner {
    display: flex;
    animation: ticker 20s linear infinite;
    white-space: nowrap;
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .badge-pulse {
    animation: badgePulse 3s ease-in-out infinite;
  }
  @keyframes badgePulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }

  .submit-btn {
    position: relative;
    overflow: hidden;
  }
  .submit-btn::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 0;
    background: #FF6B00;
    transition: width 0.28s ease;
    z-index: 0;
  }
  .submit-btn:hover::after { width: 100%; }
  .submit-btn:hover { color: #1A1A1A !important; background: #1A1A1A !important; }
`;