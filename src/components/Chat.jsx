import React, { useState, useEffect, useRef } from 'react';
import * as Ably from 'ably';

const Chat = ({ user, authToken }) => {
  const [ably, setAbly] = useState(null);
  const [channel, setChannel] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !authToken) {
      console.log('User or Auth Token not available for Ably');
      return;
    }

    const ablyClient = new Ably.Realtime({
      authCallback: async (tokenParams, callback) => {
        try {
          const response = await fetch('http://localhost:5000/api/ably-token', {
            method: 'GET',
            headers: {
              'x-auth-token': authToken,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const err = await response.text();
            callback(err, null);
            return;
          }

       
const tokenRequest = await response.json();
console.log('🔑 Full token request:', JSON.stringify(tokenRequest, null, 2));
console.log('👤 user.id being used for channel:', user.id);
console.log('🔤 clientId type:', typeof user.id, '| value:', user.id);
callback(null, tokenRequest);
          
        } catch (err) {
          console.error('Ably auth error:', err);
          callback(err, null);
          
        }
      },
      echoMessages: false,
    });

    ablyClient.connection.once('connected', () => {
      console.log('Ably connected!');
      setAbly(ablyClient);
    });

    ablyClient.connection.on('failed', (err) => {
      console.error('Ably connection failed:', err);
    });

    return () => {
      ablyClient.close();
    };
  }, [user, authToken]);

  useEffect(() => {
    if (!ably || !user) return;

    const userChannel = ably.channels.get(`private-chat:${user.id}`);

    userChannel.subscribe('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setChannel(userChannel);

    return () => {
      userChannel.unsubscribe();
    };
  }, [ably, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (messageText.trim() === '' || !channel) return;

    const messageData = {
      text: messageText,
      sender: user.username,
      senderId: user.id,
      timestamp: Date.now(),
      isAdmin: user.isAdmin,
    };

    try {
      await channel.publish('message', messageData);
      setMessageText('');
      setMessages(prev => [...prev, {
        data: messageData,
        connectionId: ably.connection.id,
      }]);
    } catch (err) {
      console.error('Error publishing message:', err);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.data.senderId === user.id ? 'sent' : 'received'}`}
          >
            <strong>{msg.data.sender}:</strong> {msg.data.text}
            <span className="timestamp">
              {new Date(msg.data.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;