import { useState } from 'react';
import AdminUsers from './AdminUsers';
import AdminAnalytics from './AdminAnalytics';
import AdminEmails from './AdminEmails';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    window.location.reload();
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div style={styles.root}>
      {/* Grid bg */}
      <div style={styles.grid} />

      {/* Top bar */}
      <header style={styles.topbar}>
        <div style={styles.topLeft}>
          <div style={styles.statusDot} />
          <span style={styles.siteLabel}>KICKSTREAM</span>
          <span style={styles.slash}>/</span>
          <span style={styles.pageLabel}>admin console</span>
        </div>
        <div style={styles.topCenter}>
          <span style={styles.timeLabel}>{timeStr}</span>
          <span style={styles.dateLabel}>{dateStr}</span>
        </div>
        <div style={styles.topRight}>
          <div style={styles.sessionPill}>
            <div style={styles.sessionDot} />
            SESSION ACTIVE
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            LOGOUT
          </button>
        </div>
      </header>

      {/* Page heading */}
      <div style={styles.pageHead}>
        <h1 style={styles.pageTitle}>COMMAND CENTER</h1>
        <p style={styles.pageSub}>// real-time platform overview &amp; management</p>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        {[
          { label: 'TOTAL USERS', value: '—', icon: '◈', color: '#5B9EFF' },
          { label: 'EMAILS QUEUED', value: '—', icon: '◉', color: '#AAFF45' },
          { label: 'CLICK EVENTS', value: '—', icon: '◆', color: '#FFB347' },
          { label: 'UPTIME', value: '99.9%', icon: '▲', color: '#FF5B5B' },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(242,240,232,0.4)' }}>{s.label}</span>
              <span style={{ color: s.color, fontSize: 16 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Syne', sans-serif", marginTop: 8 }}>{s.value}</div>
            <div style={{ height: 2, background: s.color, opacity: 0.2, borderRadius: 2, marginTop: 12 }} />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={styles.mainGrid}>
        <div style={styles.panel}>
          <AdminUsers />
        </div>
        <div style={styles.panel}>
          <AdminAnalytics />
        </div>
        <div style={{ ...styles.panel, gridColumn: '1 / -1' }}>
          <AdminEmails />
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#08080A',
    fontFamily: "'JetBrains Mono', monospace",
    color: '#F2F0E8',
    position: 'relative',
    padding: '0 0 48px',
  },
  grid: {
    position: 'fixed', inset: 0,
    backgroundImage: `linear-gradient(rgba(170,255,69,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(170,255,69,0.02) 1px, transparent 1px)`,
    backgroundSize: '48px 48px',
    pointerEvents: 'none', zIndex: 0,
  },
  topbar: {
    position: 'relative', zIndex: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#111114',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '0 32px',
    height: 52,
  },
  topLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  statusDot: { width: 7, height: 7, borderRadius: '50%', background: '#AAFF45', boxShadow: '0 0 6px #AAFF45' },
  siteLabel: { fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: '#F2F0E8' },
  slash: { color: 'rgba(242,240,232,0.2)', fontSize: 14 },
  pageLabel: { fontSize: 11, color: 'rgba(242,240,232,0.4)', letterSpacing: '0.08em' },
  topCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 },
  timeLabel: { fontSize: 13, fontWeight: 600, color: '#AAFF45', letterSpacing: '0.08em' },
  dateLabel: { fontSize: 10, color: 'rgba(242,240,232,0.3)', letterSpacing: '0.1em' },
  topRight: { display: 'flex', alignItems: 'center', gap: 12 },
  sessionPill: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 10, letterSpacing: '0.12em',
    color: '#AAFF45', padding: '4px 10px',
    border: '1px solid rgba(170,255,69,0.2)',
    borderRadius: 20,
  },
  sessionDot: { width: 6, height: 6, borderRadius: '50%', background: '#AAFF45', animation: 'pulse 2s infinite' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'transparent',
    border: '1px solid rgba(255,91,91,0.25)',
    borderRadius: 6, padding: '6px 12px',
    color: '#FF5B5B', fontSize: 11,
    letterSpacing: '0.12em', fontWeight: 600,
    cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
    transition: 'all 0.2s',
  },
  pageHead: {
    position: 'relative', zIndex: 1,
    padding: '40px 32px 8px',
  },
  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 36, fontWeight: 800,
    letterSpacing: '0.06em', color: '#F2F0E8',
  },
  pageSub: { fontSize: 12, color: 'rgba(242,240,232,0.3)', marginTop: 4, letterSpacing: '0.04em' },
  statsRow: {
    position: 'relative', zIndex: 1,
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16, padding: '24px 32px',
  },
  statCard: {
    background: '#111114',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, padding: '18px 20px',
  },
  mainGrid: {
    position: 'relative', zIndex: 1,
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 16, padding: '0 32px',
  },
  panel: {
    background: '#111114',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12, overflow: 'hidden',
  },
};