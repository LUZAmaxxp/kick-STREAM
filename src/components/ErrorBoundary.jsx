import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('ErrorBoundary:', error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#0D0D0D',
          color: '#F0EBE1',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Something went wrong.</h1>
          <p style={{ marginBottom: 16, opacity: 0.78 }}>Please reload the page or try again.</p>
          <button
            onClick={() => { this.handleReset(); window.location.reload(); }}
            style={{ background: '#B79E4F', color: '#0D0D0D', border: 'none', padding: '10px 24px', cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
