

import { useState } from 'react';
import Chat from './Chat';
import useUserNotifications from '../hooks/useUserNotifications';

export default function ChatWidget({ user }) {
  const [open, setOpen] = useState(false);
  // Pop open chat on notification
  const notifications = useUserNotifications(user, () => {
    setOpen(true);
  });

  // Helper: get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Show badge if there are unread notifications
  const hasNotification = notifications.length > 0;

  return (
    <>
      {/* Floating chat icon button */}
      <button
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 bg-black text-cream rounded-full shadow-2xl w-14 h-14 flex items-center justify-center transition-colors border-2 border-accent/30 hover:border-accent hover:bg-black-light"
        style={{
          borderRadius: '50%',
          fontSize: 0,
          right: 'max(16px, env(safe-area-inset-right))',
          bottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {hasNotification && (
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 14,
            height: 14,
            background: '#B79E4F',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0D0D0D',
            fontSize: 10,
            fontWeight: 700,
            border: '2px solid #0D0D0D',
            zIndex: 2
          }}>{notifications.length}</span>
        )}
      </button>

      {/* Chat UI overlay */}
      {open && (
        <div
          className="fixed z-50 bg-black border-2 border-border rounded-xl shadow-2xl flex flex-col"
          style={{
            right: 'max(12px, env(safe-area-inset-right))',
            left: 'max(12px, env(safe-area-inset-left))',
            bottom: 'calc(max(16px, env(safe-area-inset-bottom)) + 64px)',
            width: 'min(420px, calc(100vw - 24px))',
            marginLeft: 'auto',
            minHeight: 'min(380px, 62vh)',
            height: 'min(540px, 70vh)',
            maxHeight: '75vh',
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border bg-black-light rounded-t-xl">
            <span className="font-anton text-lg text-cream">Chat</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-cream hover:text-accent text-2xl font-bold">×</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Chat user={user} open={open} />
          </div>
        </div>
      )}
    </>
  );
}
