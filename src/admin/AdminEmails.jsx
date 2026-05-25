import { useEffect, useState } from 'react';

export default function AdminEmails() {
  const [emails, setEmails] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('client_emails');
    if (stored) {
      const parsed = JSON.parse(stored);
      setEmails(parsed);
      if (parsed.length > 0) setSelected(0);
    }
  }, []);

  const deleteEmail = (i) => {
    const updated = emails.filter((_, idx) => idx !== i);
    setEmails(updated);
    localStorage.setItem('client_emails', JSON.stringify(updated));
    setSelected(updated.length > 0 ? Math.min(i, updated.length - 1) : null);
  };

  const fmt = (ts) =>
    new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div style={styles.root}>
      {/* Panel header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AAFF45" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span style={styles.panelTitle}>CLIENT MESSAGES</span>
          {emails.length > 0 && (
            <span style={styles.unreadBadge}>{emails.length} unread</span>
          )}
        </div>
        <span style={styles.liveTag}>
          <span style={styles.liveDot} />
          INBOX
        </span>
      </div>

      {emails.length === 0 ? (
        <div style={styles.emptyState}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(242,240,232,0.15)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span>inbox is empty</span>
        </div>
      ) : (
        <div style={styles.splitPane}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            {emails.map((e, i) => (
              <div
                key={i}
                onClick={() => setSelected(i)}
                style={styles.mailItem(i === selected)}
              >
                <div style={styles.mailItemTop}>
                  <div style={styles.senderAvatar(i)}>{e.email[0].toUpperCase()}</div>
                  <div style={styles.senderInfo}>
                    <div style={styles.senderEmail}>{e.email}</div>
                    <div style={styles.senderTime}>{fmt(e.timestamp)}</div>
                  </div>
                  {i === selected && <div style={styles.activeIndicator} />}
                </div>
                <div style={styles.msgPreview}>{e.message}</div>
              </div>
            ))}
          </div>

          {/* Detail pane */}
          {selected !== null && emails[selected] && (
            <div style={styles.detail}>
              <div style={styles.detailHeader}>
                <div style={styles.detailAvatar}>{emails[selected].email[0].toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.detailEmail}>{emails[selected].email}</div>
                  <div style={styles.detailTime}>{fmt(emails[selected].timestamp)}</div>
                </div>
                <button
                  onClick={() => deleteEmail(selected)}
                  style={styles.deleteBtn}
                  title="Delete message"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  DELETE
                </button>
              </div>

              <div style={styles.detailDivider} />

              <div style={styles.msgLabel}>MESSAGE</div>
              <div style={styles.msgBody}>{emails[selected].message}</div>

              <div style={styles.replyHint}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#AAFF45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 17 4 12 9 7" />
                  <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                </svg>
                reply externally via email client
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const avatarColors = ['#5B9EFF', '#AAFF45', '#FFB347', '#FF5B5B', '#c084fc'];

const styles = {
  root: {
    fontFamily: "'JetBrains Mono', monospace",
    color: '#F2F0E8',
    display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  panelTitle: { fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#F2F0E8' },
  unreadBadge: {
    fontSize: 10, fontWeight: 700,
    background: 'rgba(170,255,69,0.1)',
    color: '#AAFF45', border: '1px solid rgba(170,255,69,0.25)',
    borderRadius: 4, padding: '1px 7px',
  },
  liveTag: {
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: 10, letterSpacing: '0.1em',
    color: 'rgba(242,240,232,0.3)',
  },
  liveDot: {
    display: 'inline-block',
    width: 5, height: 5, borderRadius: '50%', background: '#AAFF45',
  },
  emptyState: {
    padding: '48px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    fontSize: 12, color: 'rgba(242,240,232,0.25)',
    letterSpacing: '0.06em',
  },
  splitPane: {
    display: 'flex', minHeight: 320,
  },
  sidebar: {
    width: 260, flexShrink: 0,
    borderRight: '1px solid rgba(255,255,255,0.06)',
    overflowY: 'auto',
  },
  mailItem: (active) => ({
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    cursor: 'pointer',
    background: active ? 'rgba(170,255,69,0.05)' : 'transparent',
    borderLeft: active ? '2px solid #AAFF45' : '2px solid transparent',
    transition: 'all 0.15s',
  }),
  mailItemTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  senderAvatar: (i) => ({
    width: 26, height: 26, borderRadius: 4, flexShrink: 0,
    background: `${avatarColors[i % avatarColors.length]}18`,
    border: `1px solid ${avatarColors[i % avatarColors.length]}30`,
    color: avatarColors[i % avatarColors.length],
    fontSize: 10, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }),
  senderInfo: { flex: 1, minWidth: 0 },
  senderEmail: {
    fontSize: 11, color: '#F2F0E8',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  senderTime: { fontSize: 9, color: 'rgba(242,240,232,0.3)', marginTop: 1 },
  activeIndicator: { width: 5, height: 5, borderRadius: '50%', background: '#AAFF45', flexShrink: 0 },
  msgPreview: {
    fontSize: 10, color: 'rgba(242,240,232,0.4)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    paddingLeft: 34,
  },
  detail: {
    flex: 1, padding: '20px 24px',
    display: 'flex', flexDirection: 'column',
  },
  detailHeader: { display: 'flex', alignItems: 'center', gap: 12 },
  detailAvatar: {
    width: 36, height: 36, borderRadius: 6, flexShrink: 0,
    background: 'rgba(170,255,69,0.1)',
    border: '1px solid rgba(170,255,69,0.2)',
    color: '#AAFF45', fontSize: 14, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  detailEmail: { fontSize: 13, color: '#F2F0E8', fontWeight: 600 },
  detailTime: { fontSize: 10, color: 'rgba(242,240,232,0.35)', marginTop: 2 },
  deleteBtn: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: 'transparent', border: '1px solid rgba(255,91,91,0.2)',
    borderRadius: 5, padding: '5px 10px',
    color: '#FF5B5B', fontSize: 10, letterSpacing: '0.1em',
    cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
    transition: 'all 0.15s',
  },
  detailDivider: { height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' },
  msgLabel: { fontSize: 9, letterSpacing: '0.16em', color: 'rgba(242,240,232,0.3)', marginBottom: 10 },
  msgBody: {
    fontSize: 13, lineHeight: 1.7, color: 'rgba(242,240,232,0.8)',
    background: '#18181C', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8, padding: '14px 16px', flex: 1,
    whiteSpace: 'pre-wrap',
  },
  replyHint: {
    marginTop: 12,
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 10, color: 'rgba(242,240,232,0.25)', letterSpacing: '0.04em',
  },
};