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

    // Initialize Ably
    const ablyClient = new Ably.Realtime({
      authUrl: 'http://localhost:5000/api/ably-token', // Backend endpoint for Ably token
      authHeaders: {
        'x-auth-token': authToken // Pass JWT for backend authentication
      },
      echoMessages: false // Don't echo messages sent by this client back to itself
    });

    ablyClient.connection.once('connected', () => {
      console.log('Ably connected!');
      setAbly(ablyClient);
    });

    ablyClient.connection.on('failed', (err) => {
      console.error('Ably connection failed:', err);
    });

    return () => {
      if (ablyClient) {
        ablyClient.close();
      }
    };
  }, [user, authToken]);

  useEffect(() => {
    if (ably && user) {
      // Channel for user-admin private chat. Admin will also subscribe to this channel.
      const userChannel = ably.channels.get(`private-chat:${user.id}`);

      userChannel.subscribe('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      setChannel(userChannel);

      return () => {
        userChannel.unsubscribe();
      };
    }
  }, [ably, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim() === '' || !channel) return;

    const messageData = {
      text: messageText,
      sender: user.username,
      senderId: user.id,
      timestamp: Date.now(),
      isAdmin: user.isAdmin,
    };

    channel.publish('message', messageData, (err) => {
      if (err) {
        console.error('Error publishing message:', err);
      } else {
        setMessageText('');
        // Manually add message to state if echoMessages is false
        setMessages((prevMessages) => [...prevMessages, { data: messageData, connectionId: ably.connection.id }]);
      }
    });
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.data.senderId === user.id ? 'sent' : 'received'}`}>
            <strong>{msg.data.sender}:</strong> {msg.data.text}
            <span className="timestamp">{new Date(msg.data.timestamp).toLocaleTimeString()}</span>
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
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
