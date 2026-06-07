import AdminUsers from './AdminUsers';
import AdminAnalytics from './AdminAnalytics';
import AdminEmails from './AdminEmails';
import useAdminNotifications from './useAdminNotifications';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDropdown, setShowDropdown] = useState(false);
  // Pop open dropdown on notification
  const notifications = useAdminNotifications(user, () => setShowDropdown(true));
  const [stats, setStats] = useState({ totalUsers: '—', emailsQueued: '—', clickEvents: '—' });
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setStats({
          totalUsers: data.totalUsers ?? '—',
          emailsQueued: data.emailsQueued ?? '—',
          clickEvents: data.clickEvents ?? '—',
        });
      })
      .catch(() => setStats({ totalUsers: '—', emailsQueued: '—', clickEvents: '—' }));
  }, []);

  const handleLogout = () => {
    // Optionally, call backend to clear cookie
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' }).then(() => {
      window.location.reload();
    });
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
          <span style={styles.statusDot} />
          <span style={styles.siteLabel}>KICKSTREAM</span>
          <span style={styles.slash}>/</span>
          <span style={styles.pageLabel}>admin</span>
        </div>
        <div style={styles.topRight}>
          <Link to="/" style={styles.siteLink}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            BACK TO SITE
          </Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            LOGOUT
          </button>
        </div>
      </header>

      {/* Stats row - now below top bar */}
      <div style={styles.statsRow}>
        {[
          { label: 'TOTAL USERS', value: stats.totalUsers, icon: '◈', color: '#B79E4F' },
          { label: 'EMAILS QUEUED', value: stats.emailsQueued, icon: '◉', color: '#1A1A1A' },
          { label: 'CLICK EVENTS', value: stats.clickEvents, icon: '◆', color: '#B79E4F' },
          { label: 'UPTIME', value: '99.9%', icon: '▲', color: '#1A1A1A' },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(26,26,26,0.5)', fontFamily: "'Courier Prime', monospace", textTransform: 'uppercase' }}>{s.label}</span>
              <span style={{ color: s.color, fontSize: 16 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Anton', sans-serif", marginTop: 8 }}>{s.value}</div>
            <div style={{ height: 2, background: s.color, opacity: 0.3, borderRadius: 0, marginTop: 12 }} />
          </div>
        ))}
      </div>

      {/* Page heading */}
      <div style={styles.pageHead}>
        <h1 style={styles.pageTitle}>COMMAND CENTER</h1>
        <p style={styles.pageSub}>// real-time platform overview &amp; management</p>
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
    background: '#F5F3EE',
    fontFamily: "'DM Sans', sans-serif",
    color: '#1A1A1A',
    position: 'relative',
    padding: '0 0 48px',
  },
  grid: {
    position: 'fixed', inset: 0,
    backgroundImage: `linear-gradient(rgba(26,26,26,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,26,26,0.02) 1px, transparent 1px)`,
    backgroundSize: '48px 48px',
    pointerEvents: 'none', zIndex: 0,
  },
  topbar: {
    position: 'relative', zIndex: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#FAFAF8',
    borderBottom: '2px solid #1A1A1A',
    padding: '0 32px',
    height: 52,
  },
  topLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  statusDot: { width: 7, height: 7, borderRadius: '50%', background: '#B79E4F', boxShadow: '0 0 6px rgba(183, 158, 79, 0.5)' },
  siteLabel: { fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: '#1A1A1A', fontFamily: "'Anton', sans-serif" },
  slash: { color: 'rgba(26,26,26,0.3)', fontSize: 14 },
  pageLabel: { fontSize: 11, color: 'rgba(26,26,26,0.5)', letterSpacing: '0.08em' },
  topCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 },
  timeLabel: { fontSize: 13, fontWeight: 600, color: '#B79E4F', letterSpacing: '0.08em', fontFamily: "'Courier Prime', monospace" },
  dateLabel: { fontSize: 10, color: 'rgba(26,26,26,0.4)', letterSpacing: '0.1em', fontFamily: "'Courier Prime', monospace" },
  topRight: { display: 'flex', alignItems: 'center', gap: 12 },
  sessionPill: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 10, letterSpacing: '0.12em',
    color: '#1A1A1A', padding: '4px 10px',
    border: '2px solid #1A1A1A',
    borderRadius: 0,
    background: '#F5F3EE',
    fontFamily: "'Courier Prime', monospace",
  },
  sessionDot: { width: 6, height: 6, borderRadius: '50%', background: '#B79E4F', animation: 'pulse 2s infinite' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'transparent',
    border: '2px solid #B79E4F',
    borderRadius: 0, padding: '6px 12px',
    color: '#B79E4F', fontSize: 11,
    letterSpacing: '0.12em', fontWeight: 600,
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
  },
  siteLink: {
    display: 'inline-flex', alignItems: 'center',
    textDecoration: 'none',
    border: '2px solid #1A1A1A',
    background: '#F5F3EE',
    color: '#1A1A1A',
    fontSize: 11,
    letterSpacing: '0.12em',
    fontWeight: 600,
    padding: '6px 12px',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
  },
  pageHead: {
    position: 'relative', zIndex: 1,
    padding: '40px 32px 8px',
  },
  pageTitle: {
    fontFamily: "'Anton', sans-serif",
    fontSize: 36, fontWeight: 400,
    letterSpacing: '0.06em', color: '#1A1A1A',
    textTransform: 'uppercase',
  },
  pageSub: { fontSize: 12, color: 'rgba(26,26,26,0.4)', marginTop: 4, letterSpacing: '0.04em', fontFamily: "'Courier Prime', monospace" },
  statsRow: {
    position: 'relative', zIndex: 1,
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16, padding: '24px 32px',
  },
  statCard: {
    background: '#FAFAF8',
    border: '2px solid #1A1A1A',
    borderRadius: 0, padding: '18px 20px',
    boxShadow: '2px 2px 0px rgba(26, 26, 26, 0.1)',
  },
  mainGrid: {
    position: 'relative', zIndex: 1,
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 16, padding: '0 32px',
  },
  panel: {
    background: '#FAFAF8',
    border: '2px solid #1A1A1A',
    borderRadius: 0, overflow: 'hidden',
    boxShadow: '3px 3px 0px rgba(26, 26, 26, 0.15)',
  },
};
