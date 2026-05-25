
import { useState } from 'react';
import Chat from './Chat';

export default function ChatWidget({ user }) {
  const [open, setOpen] = useState(false);
  // Use the real JWT from user.authToken (set by AuthPage)
  const authToken = user?.authToken || localStorage.getItem('authToken');

  return (
    <>
      {/* Floating chat icon button */}
      <button
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] hover:bg-[#00A651] text-[#F5F3EE] rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-colors border-2 border-[#1A1A1A]"
        style={{ borderRadius: '50%', fontSize: 0 }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Chat UI overlay */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[90vw] bg-[#FFF] border-2 border-[#1A1A1A] rounded-xl shadow-2xl flex flex-col" style={{ minHeight: 400, maxHeight: 600 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#1A1A1A] bg-[#F5F3EE] rounded-t-xl">
            <span className="font-anton text-lg text-[#1A1A1A]">Chat</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-[#1A1A1A] hover:text-[#00A651] text-2xl font-bold">×</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Chat user={user} authToken={authToken} />
          </div>
        </div>
      )}
    </>
  );
}
