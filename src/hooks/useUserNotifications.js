import { useEffect, useState, useRef } from 'react';

export default function useUserNotifications(user, onNotification) {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user || !user.id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }
    let mounted = true;
    import('socket.io-client').then(({ io }) => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      const s = io(`${import.meta.env.VITE_API_URL}`);
      socketRef.current = s;
      s.emit('identify', user.id);
      s.on('user-notification', (notification) => {
        if (!mounted) return;
        setNotifications((prev) => [notification, ...prev]);
        if (typeof onNotification === 'function') onNotification(notification);
      });
    });
    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [user]);

  return notifications;
}
