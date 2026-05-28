import { useEffect, useState } from 'react';

export default function useUserNotifications(user, onNotification) {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
      if (!user) console.warn('useUserNotifications: user is missing');
      else if (!user.id) console.warn('useUserNotifications: user.id is missing');
      return;
    }
    import('socket.io-client').then(({ io }) => {
      const s = io(`${import.meta.env.VITE_API_URL}`);
      s.emit('identify', user.id);
      setSocket(s);
      s.on('user-notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        if (typeof onNotification === 'function') onNotification(notification);
      });
    });
    return () => {
      if (socket) socket.disconnect();
    };
    // eslint-disable-next-line
  }, [user, onNotification]);

  return notifications;
}
