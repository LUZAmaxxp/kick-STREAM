
import { useEffect, useState } from 'react';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('/api/admin/analytics/users', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setAnalytics(data.analytics || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load analytics');
        setLoading(false);
      });
  }, []);

  const handleExport = () => {
    fetch('/api/admin/analytics/export', {
      credentials: 'include',
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-analytics.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        setError('Failed to export analytics');
      });
  };

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFB347" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span style={styles.panelTitle}>USER ANALYTICS</span>
          <span style={styles.badge}>{analytics.length} users</span>
        </div>
        <span style={styles.liveTag}>
          <span style={styles.liveDot} />
          TELEMETRY
        </span>
        <button onClick={handleExport} style={{ marginLeft: 16, background: '#FFB347', color: '#1A1A1A', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 700, cursor: 'pointer' }}>
          Export to Excel
        </button>
      </div>
      <div style={styles.chartArea}>
        {loading ? (
          <div style={styles.emptyState}>Loading analytics...</div>
        ) : error ? (
          <div style={styles.emptyState}>{error}</div>
        ) : analytics.length === 0 ? (
          <div style={styles.emptyState}>No analytics data</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F5F3EE', borderBottom: '2px solid #FFB347' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Plan</th>
                <th style={{ textAlign: 'left', padding: 8 }}>First Visit</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Last Visit</th>
                <th style={{ textAlign: 'right', padding: 8 }}>Total Visits</th>
                <th style={{ textAlign: 'right', padding: 8 }}>Pages Viewed</th>
                <th style={{ textAlign: 'right', padding: 8 }}>Matches Watched</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Country</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((row, i) => (
                <tr key={row._id || i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: 8 }}>{row.name || '—'}</td>
                  <td style={{ padding: 8 }}>{row.email || '—'}</td>
                  <td style={{ padding: 8 }}>{row.planType || '—'}</td>
                  <td style={{ padding: 8 }}>{row.firstVisit ? new Date(row.firstVisit).toLocaleString() : '—'}</td>
                  <td style={{ padding: 8 }}>{row.lastVisit ? new Date(row.lastVisit).toLocaleString() : '—'}</td>
                  <td style={{ padding: 8, textAlign: 'right' }}>{row.totalVisits ?? '—'}</td>
                  <td style={{ padding: 8, textAlign: 'right' }}>{row.pagesViewed ?? '—'}</td>
                  <td style={{ padding: 8, textAlign: 'right' }}>{row.matchesWatched ?? '—'}</td>
                  <td style={{ padding: 8 }}>{row.country || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

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
  badge: {
    fontSize: 10, fontWeight: 600,
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
    width: 5, height: 5, borderRadius: '50%',
    background: '#E8714F',
  },
  summaryRow: {
    display: 'flex', gap: 0,
    borderBottom: '1px solid rgba(26,26,26,0.1)',
  },
  chip: {
    flex: 1, padding: '12px 16px',
    borderRight: '1px solid rgba(26,26,26,0.1)',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  chipLabel: { fontSize: 9, letterSpacing: '0.14em', color: 'rgba(26,26,26,0.4)', fontFamily: "'Courier Prime', monospace" },
  chipValue: (color) => ({
    fontSize: 16, fontWeight: 700,
    fontFamily: "'Anton', sans-serif",
    color, letterSpacing: '-0.01em',
  }),
  chartArea: {
    padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  emptyState: {
    padding: '24px 0',
    fontSize: 12, color: 'rgba(26,26,26,0.4)',
    textAlign: 'center',
  },
  barRow: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  barLabel: {
    width: 140, fontSize: 11,
    color: 'rgba(26,26,26,0.7)',
    whiteSpace: 'nowrap', overflow: 'hidden',
    textOverflow: 'ellipsis', flexShrink: 0,
  },
  barTrack: {
    flex: 1, height: 6,
    background: 'rgba(26,26,26,0.08)',
    borderRadius: 0, overflow: 'hidden',
  },
  barFill: (pct, color) => ({
    height: '100%',
    width: `${pct * 100}%`,
    background: color,
    borderRadius: 0,
    transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
    boxShadow: `0 0 8px ${color}40`,
  }),
  barCount: (color) => ({
    width: 28, textAlign: 'right',
    fontSize: 11, fontWeight: 600, color,
    flexShrink: 0,
  }),
};
