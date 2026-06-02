

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
        className="fixed z-50 bg-[#1A1A1A] hover:bg-[#00A651] text-[#F5F3EE] rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-colors border-2 border-[#1A1A1A]"
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
            background: '#E8714F',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            border: '2px solid #fff',
            zIndex: 2
          }}>{notifications.length}</span>
        )}
      </button>

      {/* Chat UI overlay */}
      {open && (
        <div
          className="fixed z-50 bg-[#FFF] border-2 border-[#1A1A1A] rounded-xl shadow-2xl flex flex-col"
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
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#1A1A1A] bg-[#F5F3EE] rounded-t-xl">
            <span className="font-anton text-lg text-[#1A1A1A]">Chat</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-[#1A1A1A] hover:text-[#00A651] text-2xl font-bold">×</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Chat user={user} open={open} />
          </div>
        </div>
      )}
    </>
  );
}
