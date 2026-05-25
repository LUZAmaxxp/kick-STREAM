import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';

const AdminApp = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin_logged_in') === 'true') {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => setLoggedIn(true);

  return loggedIn ? <AdminDashboard /> : <AdminLogin onLogin={handleLogin} />;
};

export default AdminApp;
