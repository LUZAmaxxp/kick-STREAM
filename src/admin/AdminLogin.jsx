import { useState } from 'react';

function AdminLogin({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user, password: pass }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || 'ACCESS DENIED — invalid credentials');
        setLoading(false);
        return;
      }
      if (!data.user.isAdmin) {
        setError('ACCESS DENIED — not an admin');
        setLoading(false);
        return;
      }
      // Assume backend sets cookie; just call onLogin
      onLogin();
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.root}>
      {/* Grid background */}
      <div style={styles.grid} />

      {/* Corner marks */}
      <span style={{ ...styles.corner, top: 32, left: 32 }} />
      <span style={{ ...styles.corner, top: 32, right: 32, transform: 'rotate(90deg)' }} />
      <span style={{ ...styles.corner, bottom: 32, left: 32, transform: 'rotate(-90deg)' }} />
      <span style={{ ...styles.corner, bottom: 32, right: 32, transform: 'rotate(180deg)' }} />

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={styles.dot('#AAFF45')} />
          <div style={styles.dot('#FFB347')} />
          <div style={styles.dot('#FF5B5B')} />
          <span style={styles.termTitle}>admin@kickstream ~ /login</span>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.lockIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#AAFF45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 style={styles.heading}>SECURE ACCESS</h1>
          <p style={styles.subheading}>// authentication required</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>USER_ID</label>
              <div style={styles.inputWrap}>
                <span style={styles.prompt}>$</span>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="enter username"
                  style={styles.input}
                  autoFocus
                  autoComplete="off"
                />
              </div>
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>PASSWORD</label>
              <div style={styles.inputWrap}>
                <span style={styles.prompt}>$</span>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="enter password"
                  style={styles.input}
                  autoComplete="off"
                />
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span style={{ color: '#FF5B5B', marginRight: 8 }}>✕</span>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={styles.btn(loading)}>
              {loading ? (
                <span style={styles.loadingDots}>
                  AUTHENTICATING<span style={styles.dot1}>.</span><span style={styles.dot2}>.</span><span style={styles.dot3}>.</span>
                </span>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  AUTHENTICATE
                </>
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <span style={{ color: '#AAFF45' }}>■</span> SYSTEM SECURE &nbsp;·&nbsp; TLS 1.3 &nbsp;·&nbsp; AES-256
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#F5F3EE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(26,26,26,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,26,26,0.03) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  corner: {
    position: 'absolute',
    width: 20, height: 20,
    borderTop: '2px solid rgba(232, 113, 79, 0.3)',
    borderLeft: '2px solid rgba(232, 113, 79, 0.3)',
    display: 'block',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#FAFAF8',
    border: '2px solid #1A1A1A',
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
    boxShadow: '4px 4px 0px rgba(26, 26, 26, 0.3)',
  },
  cardHeader: {
    background: '#F5F3EE',
    borderBottom: '2px solid #1A1A1A',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  dot: (color) => ({
    width: 10, height: 10,
    borderRadius: '50%',
    background: color,
    opacity: 0.8,
    flexShrink: 0,
  }),
  termTitle: {
    fontSize: 11,
    color: '#1A1A1A',
    marginLeft: 8,
    letterSpacing: '0.05em',
    opacity: 0.5,
  },
  cardBody: {
    padding: '36px 32px 28px',
  },
  lockIcon: {
    width: 52, height: 52,
    border: '2px solid #1A1A1A',
    borderRadius: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    background: '#F5F3EE',
  },
  heading: {
    fontFamily: "'Anton', sans-serif",
    fontSize: 22, fontWeight: 400,
    color: '#1A1A1A',
    letterSpacing: '0.08em',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  subheading: {
    fontSize: 12,
    color: 'rgba(26,26,26,0.5)',
    marginBottom: 28,
    letterSpacing: '0.04em',
    fontFamily: "'Courier Prime', monospace",
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: 10, letterSpacing: '0.14em',
    color: '#E8714F', fontWeight: 600,
    fontFamily: "'Courier Prime', monospace",
    textTransform: 'uppercase',
  },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    background: '#FAFAF8',
    border: '2px solid #1A1A1A',
    borderRadius: 0,
    padding: '0 12px',
    transition: 'border-color 0.2s',
  },
  prompt: {
    color: '#E8714F', fontSize: 13,
    marginRight: 8, userSelect: 'none',
    fontFamily: "'Courier Prime', monospace",
  },
  input: {
    flex: 1, background: 'transparent',
    border: 'none', outline: 'none',
    color: '#1A1A1A', fontSize: 13,
    padding: '10px 0',
    fontFamily: "'DM Sans', sans-serif",
  },
  errorBox: {
    background: 'rgba(232, 113, 79, 0.08)',
    border: '2px solid #E8714F',
    borderRadius: 0,
    padding: '10px 12px',
    fontSize: 11, color: '#E8714F',
    letterSpacing: '0.04em',
  },
  btn: (loading) => ({
    marginTop: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '12px 0',
    background: loading ? '#1A1A1A' : '#E8714F',
    color: loading ? '#F5F3EE' : '#F5F3EE',
    border: 'none', borderRadius: 0,
    fontSize: 12, fontWeight: 700,
    letterSpacing: '0.14em',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
  }),
  loadingDots: { display: 'inline-flex', alignItems: 'baseline' },
  dot1: { animation: 'blink 1s 0s infinite' },
  dot2: { animation: 'blink 1s 0.2s infinite' },
  dot3: { animation: 'blink 1s 0.4s infinite' },
  footer: {
    marginTop: 24,
    fontSize: 10, letterSpacing: '0.08em',
    color: 'rgba(26, 26, 26, 0.4)',
    textAlign: 'center',
    fontFamily: "'Courier Prime', monospace",
  },
};

export default AdminLogin;
