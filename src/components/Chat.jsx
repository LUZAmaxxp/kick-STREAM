import React, { useState, useEffect, useRef } from 'react';
import * as Ably from 'ably';
import { getAuthHeaders } from '../lib/auth';

const Chat = ({ user, open }) => {
  const ablyRef = useRef(null);
  const [ably, setAbly] = useState(null);
  const [channel, setChannel] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [connectionError, setConnectionError] = useState('');
  const [sendError, setSendError] = useState('');
  const [sending, setSending] = useState(false);
  // Track loading state for history
  const [loading, setLoading] = useState(true);
  // Fetch conversation history on mount
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/conversation?limit=20`, {
      credentials: 'include',
      headers: getAuthHeaders(),
    })
      .then(res => res.json())
      .then(data => {
        if (data.conversation && Array.isArray(data.conversation.messages)) {
          setMessages(data.conversation.messages.map(m => ({ data: m })));
        } else {
          setMessages([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user || !open) {
      if (ablyRef.current) {
        ablyRef.current.close();
        ablyRef.current = null;
        setAbly(null);
      }
      return;
    }

    if (!ablyRef.current) {
      const ablyClient = new Ably.Realtime({
        authCallback: async (tokenParams, callback) => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ably-token`, {
              method: 'GET',
              credentials: 'include',
              headers: getAuthHeaders(),
            });

            if (!response.ok) {
              const errText = await response.text();
              callback(new Error(errText || 'Unable to authenticate realtime connection'), null);
              return;
            }

            const tokenRequest = await response.json();
            callback(null, tokenRequest);
          } catch (err) {
            callback(err, null);
          }
        },
        echoMessages: false,
      });

      ablyClient.connection.once('connected', () => {
        setConnectionError('');
        setAbly(ablyClient);
      });

      ablyClient.connection.on('failed', (err) => {
        setConnectionError('Unable to connect chat on this network. Please refresh and sign in again.');
        if (import.meta.env.DEV) console.error('Ably connection failed:', err);
      });

      ablyRef.current = ablyClient;
    }

    return () => {
      if (ablyRef.current) {
        ablyRef.current.close();
        ablyRef.current = null;
        setAbly(null);
      }
    };
  }, [user, open]);

  useEffect(() => {
    if (!ably || !user) return;

    const userChannel = ably.channels.get(`private-chat:${user.id}`);

    userChannel.subscribe('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setChannel(userChannel);

    return () => {
      try { userChannel.unsubscribe(); } catch { /* noop */ }
    };
  }, [ably, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (sending) return;
    const trimmed = messageText.trim();
    if (trimmed === '') return;
    if (trimmed.length > 5000) {
      alert('Message too long (max 5000 chars).');
      return;
    }
    setSendError('');
    setSending(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/conversation/message`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({ text: trimmed })
      });
      if (!res.ok) {
        let msg = 'Failed to send message.';
        try {
          const errData = await res.json();
          if (errData?.msg) msg = errData.msg;
        } catch {
          // noop
        }
        throw new Error(msg);
      }
      const data = await res.json();
      if (data.conversation && Array.isArray(data.conversation.messages)) {
        setMessages(data.conversation.messages.map(m => ({ data: m })));
      }
      setMessageText('');
      if (channel) {
        try {
          await channel.publish('message', {
            text: trimmed,
            sender: user.username,
            senderId: user.id,
            timestamp: Date.now(),
            isAdmin: user.isAdmin,
          });
        } catch (publishErr) {
          if (import.meta.env.DEV) console.warn('Publish failed after save:', publishErr);
        }
      }
    } catch (err) {
      setSendError(err?.message || 'Failed to send message. Please try again.');
      if (import.meta.env.DEV) console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0D0D0D', borderRadius: 12, boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 12px 8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(240,235,225,0.75)', margin: 16 }}>Loading chat...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(240,235,225,0.75)', margin: 16 }}>No messages yet.</div>
        ) : (
          messages.map((msg, index) => {
            const isAdmin = msg.data.isAdmin;
            const isSelf = msg.data.senderId === user.id;
            const stableKey = msg.data._id || `${msg.data.timestamp || ''}-${msg.data.senderId || ''}-${index}`;
            return (
              <div
                key={stableKey}
                style={{
                  alignSelf: isAdmin ? 'flex-end' : (isSelf ? 'flex-end' : 'flex-start'),
                  maxWidth: '75%',
                  background: isAdmin ? '#B79E4F' : (isSelf ? '#161614' : '#111111'),
                  color: isAdmin ? '#0D0D0D' : '#F0EBE1',
                  borderRadius: isAdmin ? '16px 16px 4px 16px' : (isSelf ? '16px 16px 4px 16px' : '16px 16px 16px 4px'),
                  padding: '10px 16px',
                  marginBottom: 2,
                  boxShadow: isAdmin ? '0 2px 10px 0 rgba(183,158,79,0.12)' : (isSelf ? '0 2px 10px 0 rgba(255,255,255,0.05)' : '0 2px 10px 0 rgba(0,0,0,0.18)'),
                  fontSize: 14,
                  position: 'relative',
                  wordBreak: 'break-word',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2, opacity: 0.7 }}>
                  {msg.data.senderName || msg.data.sender || (isAdmin ? 'Admin' : 'You')}
                </div>
                <div>{msg.data.text}</div>
                <div style={{ fontSize: 10, color: isAdmin || isSelf ? 'rgba(255,255,255,0.7)' : '#888', marginTop: 4, textAlign: 'right' }}>
                  {msg.data.timestamp ? new Date(msg.data.timestamp).toLocaleTimeString() : ''}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ borderTop: '1.5px solid #2A2A26', padding: '10px 12px', background: '#161614', borderRadius: '0 0 12px 12px' }}>
        {!!connectionError && (
          <div style={{ color: '#b42318', fontSize: 12, marginBottom: 6 }}>
            {connectionError}
          </div>
        )}
        {!!sendError && (
          <div style={{ color: '#b42318', fontSize: 12, marginBottom: 6 }}>
            {sendError}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={channel ? 'Type your message...' : 'Type your message...'}
            disabled={sending}
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 15,
              padding: '8px 0',
              color: '#F0EBE1',
              opacity: sending ? 0.6 : 1,
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || messageText.trim() === ''}
            style={{
              background: sending || messageText.trim() === '' ? 'rgba(240,235,225,0.12)' : '#B79E4F',
              color: sending || messageText.trim() === '' ? 'rgba(240,235,225,0.5)' : '#0D0D0D',
              border: 'none',
              borderRadius: 8,
              padding: '8px 14px',
              fontWeight: 600,
              fontSize: 14,
              cursor: sending || messageText.trim() === '' ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;