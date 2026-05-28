
import { useEffect, useState } from 'react';

export default function AdminEmails() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [replyStatus, setReplyStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/conversations`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setConversations(data.conversations || []);
        if ((data.conversations || []).length > 0) setSelected(0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fmt = (ts) =>
    new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const handleReply = async () => {
    if (!reply.trim() || selected === null) return;
    setReplyStatus("Sending...");
    setError("");
    const convo = conversations[selected];
    if (!convo || !convo.participants || convo.participants.length === 0) return;
    const userId = convo.participants[0]._id || convo.participants[0].id;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/conversation/${userId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply }),
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.msg || "Failed to send reply");
        setReplyStatus("");
        return;
      }
      // Update conversation with new message
      const data = await res.json();
      const updated = [...conversations];
      updated[selected] = data.conversation;
      setConversations(updated);
      setReplyStatus("Reply sent!");
      setReply("");
    } catch (e) {
      setError("Failed to send reply");
      setReplyStatus("");
    }
  };

  return (
    <div style={styles.root}>
      {/* Panel header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AAFF45" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span style={styles.panelTitle}>CLIENT CONVERSATIONS</span>
          {conversations.length > 0 && (
            <span style={styles.unreadBadge}>{conversations.length} users</span>
          )}
        </div>
        <span style={styles.liveTag}>
          <span style={styles.liveDot} />
          INBOX
        </span>
      </div>

      {loading ? (
        <div style={styles.emptyState}>Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <div style={styles.emptyState}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(242,240,232,0.15)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span>No conversations yet</span>
        </div>
      ) : (
        <div style={styles.splitPane}>
          {/* Sidebar: list of conversations by user */}
          <div style={styles.sidebar}>
            {conversations.map((c, i) => {
              const user = c.participants && c.participants[0];
              return (
                <div
                  key={c._id || i}
                  onClick={() => setSelected(selected === i ? null : i)}
                  style={styles.mailItem(i === selected)}
                >
                  <div style={styles.mailItemTop}>
                    <div style={styles.senderAvatar(i)}>{(user?.email || user?.username || 'U')[0].toUpperCase()}</div>
                    <div style={styles.senderInfo}>
                      <div style={styles.senderEmail}>{user?.email || user?.username || 'Unknown'}</div>
                      <div style={styles.senderTime}>{c.lastUpdated ? fmt(c.lastUpdated) : ''}</div>
                    </div>
                    {i === selected && <div style={styles.activeIndicator} />}
                  </div>
                  <div style={styles.msgPreview}>{c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1].text : 'No messages yet'}</div>
                </div>
              );
            })}
          </div>

          {/* Detail pane: full conversation thread */}
          {selected !== null && conversations[selected] && (
            <div style={styles.detail}>
              <div style={styles.detailHeader}>
                <div style={styles.detailAvatar}>{(conversations[selected].participants[0]?.email || conversations[selected].participants[0]?.username || 'U')[0].toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.detailEmail}>{conversations[selected].participants[0]?.email || conversations[selected].participants[0]?.username || 'Unknown'}</div>
                  <div style={styles.detailTime}>{conversations[selected].lastUpdated ? fmt(conversations[selected].lastUpdated) : ''}</div>
                </div>
              </div>

              <div style={styles.detailDivider} />

              <div style={styles.msgLabel}>CONVERSATION</div>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '40vh' }}>
                {conversations[selected].messages && conversations[selected].messages.length > 0 ? (
                  conversations[selected].messages.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: m.isAdmin ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        background: m.isAdmin ? '#E8714F' : '#F5F3EE',
                        color: m.isAdmin ? '#fff' : '#1A1A1A',
                        borderRadius: m.isAdmin ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        padding: '10px 16px',
                        marginBottom: 2,
                        boxShadow: m.isAdmin ? '0 2px 8px 0 rgba(232,113,79,0.08)' : '0 2px 8px 0 rgba(26,26,26,0.04)',
                        fontSize: 14,
                        position: 'relative',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2, opacity: 0.7 }}>
                        {m.senderName || (m.isAdmin ? 'Admin' : 'User')}
                      </div>
                      <div>{m.text}</div>
                      <div style={{ fontSize: 10, color: m.isAdmin ? 'rgba(255,255,255,0.7)' : '#888', marginTop: 4, textAlign: 'right' }}>
                        {m.timestamp ? fmt(m.timestamp) : ''}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#888', fontSize: 13 }}>No messages yet.</div>
                )}
              </div>

              <div style={styles.msgLabel}>REPLY</div>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', marginBottom: 8 }}
                placeholder="Type your reply here..."
              />
              <button
                onClick={handleReply}
                style={{ ...styles.deleteBtn, background: '#AAFF45', color: '#1A1A1A', border: 'none', marginRight: 8 }}
                disabled={!reply.trim() || replyStatus === 'Sending...'}
              >
                {replyStatus === 'Sending...' ? 'Sending...' : 'Send Reply'}
              </button>
              {replyStatus && replyStatus !== 'Sending...' && <span style={{ color: '#00A651', marginLeft: 8 }}>{replyStatus}</span>}
              {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
            </div>
          )}
        </div>
      )}
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
  unreadBadge: {
    fontSize: 10, fontWeight: 700,
    background: 'transparent',
    color: '#E8714F', border: '2px solid #E8714F',
    borderRadius: 0, padding: '1px 7px',
  },
  liveTag: {
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: 10, letterSpacing: '0.1em',
    color: 'rgba(26,26,26,0.5)',
    fontFamily: "'Courier Prime', monospace",
  },
  liveDot: {
    display: 'inline-block',
    width: 5, height: 5, borderRadius: '50%', background: '#E8714F',
  },
  emptyState: {
    padding: '48px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    fontSize: 12, color: 'rgba(26,26,26,0.4)',
    letterSpacing: '0.06em',
  },
  splitPane: {
    display: 'flex',
    minHeight: 480,
    height: '60vh',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 16px 0 rgba(26,26,26,0.06)',
    overflow: 'hidden',
  },
  sidebar: {
    width: 280,
    flexShrink: 0,
    borderRight: '1.5px solid #F5F3EE',
    background: '#FAFAF8',
    overflowY: 'auto',
    paddingTop: 8,
  },
  mailItem: (active) => ({
    padding: '14px 16px',
    borderBottom: '1px solid rgba(26,26,26,0.08)',
    cursor: 'pointer',
    background: active ? 'rgba(232, 113, 79, 0.05)' : 'transparent',
    borderLeft: active ? '2px solid #E8714F' : '2px solid transparent',
    transition: 'all 0.15s',
  }),
  mailItemTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  senderAvatar: (i) => ({
    width: 26, height: 26, borderRadius: 0, flexShrink: 0,
    background: 'transparent',
    border: `2px solid ${avatarColors[i % avatarColors.length]}`,
    color: avatarColors[i % avatarColors.length],
    fontSize: 10, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }),
  senderInfo: { flex: 1, minWidth: 0 },
  senderEmail: {
    fontSize: 11, color: '#1A1A1A',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  senderTime: { fontSize: 9, color: 'rgba(26,26,26,0.4)', marginTop: 1, fontFamily: "'Courier Prime', monospace" },
  activeIndicator: { width: 5, height: 5, borderRadius: '50%', background: '#E8714F', flexShrink: 0 },
  msgPreview: {
    fontSize: 10, color: 'rgba(26,26,26,0.5)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    paddingLeft: 34,
  },
  detail: {
    flex: 1,
    padding: '32px 32px 16px 32px',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    minWidth: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
  detailHeader: { display: 'flex', alignItems: 'center', gap: 12 },
  detailAvatar: {
    width: 36, height: 36, borderRadius: 0, flexShrink: 0,
    background: 'transparent',
    border: '2px solid #E8714F',
    color: '#E8714F', fontSize: 14, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  detailEmail: { fontSize: 13, color: '#1A1A1A', fontWeight: 600 },
  detailTime: { fontSize: 10, color: 'rgba(26,26,26,0.4)', marginTop: 2, fontFamily: "'Courier Prime', monospace" },
  deleteBtn: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: 'transparent', border: '2px solid #E8714F',
    borderRadius: 0, padding: '5px 10px',
    color: '#E8714F', fontSize: 10, letterSpacing: '0.1em',
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s',
  },
  detailDivider: { height: 1, background: 'rgba(26,26,26,0.1)', margin: '16px 0' },
  msgLabel: { fontSize: 9, letterSpacing: '0.16em', color: 'rgba(26,26,26,0.5)', marginBottom: 10, fontFamily: "'Courier Prime', monospace" },
  msgBody: {
    fontSize: 13, lineHeight: 1.7, color: '#1A1A1A',
    background: '#FAFAF8', border: '2px solid #1A1A1A',
    borderRadius: 0, padding: '14px 16px', flex: 1,
    whiteSpace: 'pre-wrap',
  },
  replyHint: {
    marginTop: 12,
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 10, color: 'rgba(26,26,26,0.4)', letterSpacing: '0.04em',
    fontFamily: "'Courier Prime', monospace",
  },
};
