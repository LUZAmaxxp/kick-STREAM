import { useEffect, useState } from 'react';

export default function AdminAnalytics() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('analytics_events');
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  const countByLabel = events.reduce((acc, e) => {
    acc[e.label] = (acc[e.label] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(countByLabel).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  const total = events.length;

  const barColor = (pct) => {
    if (pct > 0.7) return '#E8714F';
    if (pct > 0.4) return '#1A1A1A';
    return '#E8714F';
  };

  return (
    <div style={styles.root}>
      {/* Panel header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFB347" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span style={styles.panelTitle}>CLICK ANALYTICS</span>
          <span style={styles.badge}>{total} events</span>
        </div>
        <span style={styles.liveTag}>
          <span style={styles.liveDot} />
          TELEMETRY
        </span>
      </div>

      {/* Summary chips */}
      <div style={styles.summaryRow}>
        <div style={styles.chip}>
          <span style={styles.chipLabel}>UNIQUE ELEMENTS</span>
          <span style={styles.chipValue('#FFB347')}>{sorted.length}</span>
        </div>
        <div style={styles.chip}>
          <span style={styles.chipLabel}>TOP EVENT</span>
          <span style={styles.chipValue('#AAFF45')}>{sorted[0]?.[0] ?? '—'}</span>
        </div>
        <div style={styles.chip}>
          <span style={styles.chipLabel}>TOTAL CLICKS</span>
          <span style={styles.chipValue('#5B9EFF')}>{total}</span>
        </div>
      </div>

      {/* Bar chart */}
      <div style={styles.chartArea}>
        {sorted.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ color: '#FFB347', marginRight: 8 }}>◆</span>
            no click events recorded yet
          </div>
        ) : (
          sorted.map(([label, count], i) => {
            const pct = count / max;
            const color = barColor(pct);
            return (
              <div key={label} style={styles.barRow}>
                <div style={styles.barLabel}>
                  <span style={{ color: 'rgba(242,240,232,0.4)', marginRight: 6, fontSize: 10 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {label}
                </div>
                <div style={styles.barTrack}>
                  <div style={styles.barFill(pct, color)} />
                </div>
                <div style={styles.barCount(color)}>{count}</div>
              </div>
            );
          })
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
