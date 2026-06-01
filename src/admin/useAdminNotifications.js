// src/admin/useAdminNotifications.js
import { useEffect, useRef, useState } from 'react';
import { getSocket, disconnectSocket } from '../lib/socket';

export default function useAdminNotifications(user, onNotification) {
  const [notifications, setNotifications] = useState([]);
  const cbRef = useRef(onNotification);
  cbRef.current = onNotification;

  useEffect(() => {
    if (!user || !user.id) {
      disconnectSocket();
      return;
    }
    const s = getSocket();

    const handler = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      if (typeof cbRef.current === 'function') cbRef.current(notification);
    };
    s.on('admin-notification', handler);

    return () => {
      s.off('admin-notification', handler);
    };
  }, [user]);

  return notifications;
}
