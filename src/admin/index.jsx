import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';


const AdminApp = () => {
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Check admin session from backend
    fetch('/api/session', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data.user && data.user.isAdmin) setAdminUser(data.user);
        else setAdminUser(null);
      })
      .catch(() => setAdminUser(null));
  }, []);

  const handleLogin = () => {
    // After login, re-fetch user
    fetch('/api/session', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data.user && data.user.isAdmin) setAdminUser(data.user);
        else setAdminUser(null);
      })
      .catch(() => setAdminUser(null));
  };

  return adminUser ? <AdminDashboard user={adminUser} /> : <AdminLogin onLogin={handleLogin} />;
};

export default AdminApp;
