import { useEffect, useState } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('site_users');
    if (stored) setUsers(JSON.parse(stored));
  }, []);

  return (
    <div style={styles.root}>
      {/* Panel header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B9EFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span style={styles.panelTitle}>USERS</span>
          <span style={styles.badge(users.length > 0 ? '#5B9EFF' : '#888')}>{users.length}</span>
        </div>
        <span style={styles.liveTag}>
          <span style={styles.liveDot('#5B9EFF')} />
          REGISTRY
        </span>
      </div>

      {/* Column labels */}
      <div style={styles.colRow}>
        <span style={{ flex: 2 }}>IDENTIFIER</span>
        <span style={{ flex: 1, textAlign: 'center' }}>VISITS</span>
        <span style={{ flex: 1, textAlign: 'right' }}>STATUS</span>
      </div>

      {/* Rows */}
      <div style={styles.list}>
        {users.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ color: '#5B9EFF', marginRight: 8 }}>◈</span>
            no users registered yet
          </div>
        ) : (
          users.map((u, i) => (
            <div key={i} style={styles.row(i)}>
              <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={styles.avatar(i)}>
                  {(u.email || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <div style={styles.emailText}>{u.email || 'anonymous@unknown'}</div>
                  <div style={styles.uidText}>uid_{String(i + 1).padStart(4, '0')}</div>
                </div>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={styles.visitBadge(u.visits || 1)}>{u.visits || 1}</span>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <span style={styles.statusPill('ACTIVE')}>ACTIVE</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const avatarColors = ['#E8714F', '#1A1A1A', '#E8714F', '#1A1A1A', '#E8714F'];

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    color: '#1A1A1A',
    display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '2px solid #1A1A1A',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  panelTitle: { fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#1A1A1A', textTransform: 'uppercase' },
  badge: (color) => ({
    fontSize: 10, fontWeight: 700,
    background: 'transparent',
    color: color,
    border: `2px solid ${color}`,
    borderRadius: 0, padding: '1px 6px',
  }),
  liveTag: {
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: 10, letterSpacing: '0.1em',
    color: 'rgba(26,26,26,0.5)',
    fontFamily: "'Courier Prime', monospace",
  },
  liveDot: (color) => ({
    display: 'inline-block',
    width: 5, height: 5, borderRadius: '50%',
    background: color,
  }),
  colRow: {
    display: 'flex', padding: '8px 20px',
    fontSize: 9, letterSpacing: '0.14em',
    color: 'rgba(26,26,26,0.4)',
    borderBottom: '1px solid rgba(26,26,26,0.1)',
    fontFamily: "'Courier Prime', monospace",
  },
  list: { display: 'flex', flexDirection: 'column' },
  emptyState: {
    padding: '32px 20px',
    fontSize: 12, color: 'rgba(26,26,26,0.4)',
    textAlign: 'center',
  },
  row: (i) => ({
    display: 'flex', alignItems: 'center',
    padding: '12px 20px',
    borderBottom: '1px solid rgba(26,26,26,0.08)',
    background: i % 2 === 0 ? 'transparent' : 'rgba(26,26,26,0.02)',
    transition: 'background 0.15s',
  }),
  avatar: (i) => ({
    width: 28, height: 28,
    borderRadius: 0,
    background: 'transparent',
    border: `2px solid ${avatarColors[i % avatarColors.length]}`,
    color: avatarColors[i % avatarColors.length],
    fontSize: 11, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }),
  emailText: { fontSize: 12, color: '#1A1A1A', letterSpacing: '0.02em' },
  uidText: { fontSize: 10, color: 'rgba(26,26,26,0.4)', marginTop: 1, fontFamily: "'Courier Prime', monospace" },
  visitBadge: (visits) => ({
    display: 'inline-block',
    fontSize: 11, fontWeight: 600,
    color: visits > 5 ? '#E8714F' : visits > 2 ? '#1A1A1A' : 'rgba(26,26,26,0.5)',
    background: visits > 5 ? 'rgba(232, 113, 79, 0.08)' : 'transparent',
    padding: '2px 8px', borderRadius: 0,
  }),
  statusPill: (status) => ({
    display: 'inline-block',
    fontSize: 9, letterSpacing: '0.12em', fontWeight: 700,
    background: 'transparent',
    color: '#E8714F',
    border: '2px solid #E8714F',
    padding: '3px 8px', borderRadius: 0,
  }),
};
