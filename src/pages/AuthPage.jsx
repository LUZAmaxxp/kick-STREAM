import { useState, useEffect, useRef } from 'react';
import videoBg from '../assets/13406407_1080_1920_30fps.mp4';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, getAuthHeaders, clearAuthToken } from '../lib/auth';

const TICKER_ITEMS = [
  'Welcome back', 'Sign in to continue', 'New here? Join us',
  'Your journey starts now', 'Welcome back', 'Sign in to continue',
  'New here? Join us', 'Your journey starts now',
];

// const PHOTO_URL =
//   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80';

export default function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user'); // 'user' | 'admin'
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
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) { setError('Please enter a valid email.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError('');
    setSubmitted(true);
    try {
        // Admin role only supports sign-in; registration is user-only
        const useLogin = role === 'admin' ? true : isLogin;
        const endpoint = useLogin ? '/api/auth/login' : '/api/auth/register';
        const loginPayload = { email, password, loginAs: role };
        const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(useLogin ? loginPayload : { email, password, username: email.split('@')[0] }),
          credentials: 'include',
        });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || 'Authentication failed');
        setSubmitted(false);
        return;
      }
      if (role === 'admin' && !data.user?.isAdmin) {
        setError('This account is not an administrator.');
        setSubmitted(false);
        // Best-effort logout on server so the cookie isn't left around
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders(),
          });
        } catch {
          /* noop */
        }
        clearAuthToken();
        return;
      }
      if (role === 'user' && data.user?.isAdmin) {
        setError('This is an admin account. Please switch to Admin login.');
        setSubmitted(false);
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders(),
          });
        } catch {
          /* noop */
        }
        clearAuthToken();
        return;
      }
      if (data.token) setAuthToken(data.token);
      onAuth({ ...data.user, authToken: data.token });
      navigate(data.user?.isAdmin ? '/admin' : '/');
    } catch (err) {
      setError('Server error. Please try again.');
      setSubmitted(false);
    }
  };

  const switchMode = () => {
    if (role === 'admin') return; // no register in admin mode
    setIsLogin((v) => !v);
    setError('');
    setSubmitted(false);
  };

  const switchRole = (next) => {
    setRole(next);
    setError('');
    setSubmitted(false);
    if (next === 'admin') setIsLogin(true); // force login for admin
  };

  return (
    <div className="auth-root" style={s.root}>
      <style>{css}</style>

      {/* ── LEFT PANEL ── */}
      <div className="auth-left" style={s.left}>
        <video
          className="photo-zoom"
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
      <div className="auth-right" style={s.right}>
        {/* Corner accents */}
        <div className="auth-corner" style={s.cornerTR} />
        <div className="auth-corner" style={s.cornerBL} />

        {/* Dot grid */}
        <div className="auth-dot-grid" style={s.dotGrid}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={s.dot} />
          ))}
        </div>

        {/* Role toggle: User / Admin */}
        <div className="auth-mode-toggle" style={{ ...s.modeToggle, marginBottom: 12 }}>
          <button
            type="button"
            style={role === 'user' ? { ...s.modeBtn, ...s.modeBtnActive } : s.modeBtn}
            onClick={() => switchRole('user')}
          >
            User
          </button>
          <button
            type="button"
            style={role === 'admin' ? { ...s.modeBtn, ...s.modeBtnActive, background: '#B79E4F', color: '#0D0D0D' } : s.modeBtn}
            onClick={() => switchRole('admin')}
          >
            Admin
          </button>
        </div>

        {/* Toggle */}
        <div className="auth-mode-toggle" style={s.modeToggle}>
          <button
            type="button"
            style={isLogin ? { ...s.modeBtn, ...s.modeBtnActive } : s.modeBtn}
            onClick={() => { if (role === 'admin') return; setIsLogin(true); setError(''); }}
            disabled={role === 'admin'}
          >
            Sign In
          </button>
          <button
            type="button"
            style={!isLogin ? { ...s.modeBtn, ...s.modeBtnActive } : { ...s.modeBtn, opacity: role === 'admin' ? 0.4 : 1, cursor: role === 'admin' ? 'not-allowed' : 'pointer' }}
            onClick={() => { if (role === 'admin') return; setIsLogin(false); setError(''); }}
            disabled={role === 'admin'}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <div className="auth-form-header" style={s.formHeader}>
          <h2 style={s.formTitle}>
            {role === 'admin' ? 'Admin access' : (isLogin ? 'Welcome back' : 'Join us today')}
          </h2>
          <p style={s.formSub}>
            {role === 'admin'
              ? 'Sign in with your administrator credentials'
              : (isLogin ? 'Enter your credentials to continue' : 'Create your account in seconds')}
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
                color: focused === 'email' ? '#B79E4F' : '#888',
              }}>✉</span>
              <input
                type="email"
                placeholder="you@example.com"
                style={{
                  ...s.input,
                  borderColor: focused === 'email' ? '#B79E4F' : '#2A2A26',
                  boxShadow: focused === 'email' ? '0 0 0 3px rgba(183, 158, 79, 0.12)' : 'none',
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
                color: focused === 'password' ? '#B79E4F' : '#888',
              }} aria-hidden="true">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  ...s.input,
                  borderColor: focused === 'password' ? '#B79E4F' : '#2A2A26',
                  boxShadow: focused === 'password' ? '0 0 0 3px rgba(183, 158, 79, 0.12)' : 'none',
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
            className="submit-btn auth-submit-btn"
            style={{
              ...s.submitBtn,
              background: submitted ? '#B79E4F' : '#0D0D0D',
              color: submitted ? '#0D0D0D' : '#F0EBE1',
              border: submitted ? '1px solid rgba(183, 158, 79, 0.5)' : '1px solid rgba(183, 158, 79, 0.2)',
            }}
          >
            <span style={s.submitInner}>
              {submitted ? '✓ Done!' : (role === 'admin' ? 'Sign In as Admin →' : (isLogin ? 'Sign In →' : 'Create Account →'))}
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
        {role !== 'admin' && (
          <p style={s.switchRow}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" style={s.switchLink} onClick={switchMode}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const s = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    background: '#0D0D0D',
    fontFamily: "'DM Sans', sans-serif",
    overflow: 'hidden',
    position: 'relative',
    color: '#F0EBE1',
  },

  /* LEFT */
  left: {
    flex: '1.1',
    background: '#0D0D0D',
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
  },
  leftOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(160deg, rgba(13,13,13,0.15) 30%, rgba(13,13,13,0.95) 85%)',
  },
  ticker: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    background: '#B79E4F',
    overflow: 'hidden',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
  },
  tickerItem: {
    fontFamily: "'Anton', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.18em',
    color: '#0D0D0D',
    textTransform: 'uppercase',
    padding: '0 20px',
    whiteSpace: 'nowrap',
  },
  tickerDot: { color: '#0D0D0D', opacity: 0.55, margin: '0 4px' },
  badge: {
    position: 'absolute',
    top: '56px',
    right: '-8px',
    background: '#B79E4F',
    color: '#0D0D0D',
    fontFamily: "'Anton', sans-serif",
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '5px 14px',
    transform: 'rotate(-90deg)',
    transformOrigin: 'right center',
  },
  leftContent: { position: 'relative', zIndex: 2 },
  accentBar: { width: '40px', height: '3px', background: '#B79E4F', marginBottom: '16px' },
  bigLabel: {
    fontFamily: "'Anton', sans-serif",
    fontSize: 'clamp(38px, 5vw, 58px)',
    lineHeight: 1,
    color: '#F0EBE1',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  bigLabelOrange: { color: '#B79E4F' },
  subLabel: {
    fontSize: '13px',
    color: 'rgba(240,235,225,0.8)',
    letterSpacing: '0.05em',
    maxWidth: '220px',
    lineHeight: 1.65,
  },

  /* RIGHT */
  right: {
    flex: '0.9',
    background: 'linear-gradient(180deg, rgba(13,13,13,0.98) 0%, rgba(22,22,20,1) 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '48px 44px',
    position: 'relative',
  },
  cornerTR: {
    position: 'absolute', top: 20, right: 20,
    width: 28, height: 28,
    borderTop: '2px solid #B79E4F',
    borderRight: '2px solid #B79E4F',
  },
  cornerBL: {
    position: 'absolute', bottom: 20, left: 20,
    width: 28, height: 28,
    borderBottom: '2px solid #B79E4F',
    borderLeft: '2px solid #B79E4F',
  },
  dotGrid: {
    position: 'absolute', bottom: 46, right: 40,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 6px)',
    gridTemplateRows: 'repeat(4, 6px)',
    gap: '4px',
    opacity: 0.15,
  },
  dot: { width: '3px', height: '3px', background: '#B79E4F', borderRadius: '50%' },

  modeToggle: {
    display: 'flex',
    background: 'rgba(183, 158, 79, 0.08)',
    padding: '3px',
    gap: '3px',
    width: 'fit-content',
    marginBottom: '28px',
    borderRadius: '999px',
  },
  modeBtn: {
    fontFamily: "'Anton', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '7px 22px',
    border: 'none',
    background: 'transparent',
    color: '#F0EBE1',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    borderRadius: '999px',
  },
  modeBtnActive: { background: '#B79E4F', color: '#0D0D0D' },

  formHeader: { marginBottom: '28px' },
  formTitle: {
    fontFamily: "'Anton', sans-serif",
    fontSize: '34px',
    color: '#F0EBE1',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    lineHeight: 1,
    marginBottom: '6px',
    fontWeight: 400,
  },
  formSub: { fontSize: '12px', color: 'rgba(240,235,225,0.75)', letterSpacing: '0.04em' },

  form: { display: 'flex', flexDirection: 'column', gap: 0 },

  inputGroup: { marginBottom: '14px' },
  inputLabel: {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#C3B89A',
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
    border: '1.5px solid #2A2A26',
    background: '#111111',
    padding: '11px 14px 11px 38px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#F0EBE1',
    borderRadius: '12px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  error: {
    fontSize: '11px',
    color: '#FF6B6B',
    letterSpacing: '0.04em',
    marginBottom: '10px',
    marginTop: '-4px',
  },

  submitBtn: {
    width: '100%',
    border: '1px solid rgba(183, 158, 79, 0.25)',
    fontFamily: "'Anton', sans-serif",
    fontSize: '13px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    padding: '13px 0',
    cursor: 'pointer',
    borderRadius: '12px',
    marginTop: '6px',
    transition: 'background 0.25s, color 0.25s',
    position: 'relative',
    overflow: 'hidden',
  },
  submitInner: { position: 'relative', zIndex: 1 },

  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0' },
  divLine: { flex: 1, height: '1px', background: '#2A2A26' },
  divText: { fontSize: '11px', color: 'rgba(240,235,225,0.65)', letterSpacing: '0.08em' },

  switchRow: { textAlign: 'center', fontSize: '12px', color: 'rgba(240,235,225,0.75)' },
  switchLink: {
    color: '#B79E4F',
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
    background: #B79E4F;
    transition: width 0.28s ease;
    z-index: 0;
  }
  .submit-btn:hover::after { width: 100%; }
  .submit-btn:hover { color: #0D0D0D !important; background: #F0EBE1 !important; }

  @media (max-width: 960px) {
    .auth-root {
      min-height: 100dvh;
      overflow-y: auto;
    }
    .auth-left {
      display: none !important;
    }
    .auth-right {
      flex: 1 1 auto !important;
      width: 100% !important;
      min-height: 100dvh;
      padding: 28px 18px !important;
      justify-content: center !important;
    }
    .auth-corner,
    .auth-dot-grid {
      display: none !important;
    }
    .auth-form-header h2 {
      font-size: 28px !important;
      line-height: 1.08 !important;
    }
    .auth-mode-toggle {
      width: 100% !important;
      display: grid !important;
      grid-template-columns: 1fr 1fr;
      margin-bottom: 14px !important;
    }
    .auth-mode-toggle button {
      width: 100% !important;
      min-height: 42px;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .auth-submit-btn {
      min-height: 48px;
    }
  }

  @media (max-width: 420px) {
    .auth-right {
      padding: 22px 14px !important;
    }
    .auth-form-header h2 {
      font-size: 24px !important;
    }
  }
`;