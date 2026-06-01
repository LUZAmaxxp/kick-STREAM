import { useEffect, useState, useRef } from 'react';
import { getSocket, disconnectSocket } from '../lib/socket';

export default function useUserNotifications(user, onNotification) {
  const [notifications, setNotifications] = useState([]);
  const cbRef = useRef(onNotification);
  cbRef.current = onNotification;

  useEffect(() => {
    if (!user || !user.id) {
      disconnectSocket();
      return;
    }
    let mounted = true;
    const s = getSocket();

    const handler = (notification) => {
      if (!mounted) return;
      setNotifications((prev) => [notification, ...prev]);
      if (typeof cbRef.current === 'function') cbRef.current(notification);
    };
    s.on('user-notification', handler);

    return () => {
      mounted = false;
      s.off('user-notification', handler);
    };
  }, [user]);

  return notifications;
}
