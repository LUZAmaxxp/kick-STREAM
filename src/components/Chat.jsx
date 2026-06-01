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
    const trimmed = messageText.trim();
    if (trimmed === '') return;
    if (trimmed.length > 5000) {
      alert('Message too long (max 5000 chars).');
      return;
    }
    if (!channel) {
      alert('Chat is still connecting. Please wait...');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/conversation/message`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({ text: trimmed })
      });
      if (!res.ok) throw new Error('Failed to send');
      const data = await res.json();
      if (data.conversation && Array.isArray(data.conversation.messages)) {
        setMessages(data.conversation.messages.map(m => ({ data: m })));
      }
      setMessageText('');
      await channel.publish('message', {
        text: trimmed,
        sender: user.username,
        senderId: user.id,
        timestamp: Date.now(),
        isAdmin: user.isAdmin,
      });
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error sending message:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 400, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px 0 rgba(26,26,26,0.06)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 12px 8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', margin: 16 }}>Loading chat...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', margin: 16 }}>No messages yet.</div>
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
                  background: isAdmin ? '#E8714F' : (isSelf ? '#00A651' : '#F5F3EE'),
                  color: isAdmin || isSelf ? '#fff' : '#1A1A1A',
                  borderRadius: isAdmin ? '16px 16px 4px 16px' : (isSelf ? '16px 16px 4px 16px' : '16px 16px 16px 4px'),
                  padding: '10px 16px',
                  marginBottom: 2,
                  boxShadow: isAdmin ? '0 2px 8px 0 rgba(232,113,79,0.08)' : (isSelf ? '0 2px 8px 0 rgba(0,166,81,0.08)' : '0 2px 8px 0 rgba(26,26,26,0.04)'),
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
      <div style={{ display: 'flex', alignItems: 'center', borderTop: '1.5px solid #F5F3EE', padding: '10px 12px', background: '#FAFAF8', borderRadius: '0 0 12px 12px' }}>
        {!!connectionError && (
          <div style={{ color: '#b42318', fontSize: 12, marginRight: 8 }}>
            {connectionError}
          </div>
        )}
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && channel) handleSendMessage();
          }}
          placeholder={channel ? "Type your message..." : "Connecting..."}
          disabled={!channel}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 15,
            padding: '8px 0',
            color: '#1A1A1A',
            opacity: channel ? 1 : 0.5,
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!channel || messageText.trim() === ''}
          style={{
            marginLeft: 8,
            background: channel ? '#00A651' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontWeight: 600,
            fontSize: 15,
            cursor: channel ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          {channel ? 'Send' : 'Connecting...'}
        </button>
      </div>
    </div>
  );
};

export default Chat;