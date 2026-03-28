import { useEffect, useState } from 'react';
import App from './App';
import AdminPanel from './AdminPanel';
import './Router.css';

// Environment variable'dan admin path al
const SECRET_ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '/secret-admin-panel-xyz123';

export const Router = () => {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'admin'>('home');

  // URL'den route'u al
  useEffect(() => {
    const path = window.location.pathname;
    if (path === SECRET_ADMIN_PATH) {
      setCurrentRoute('admin');
    }
  }, []);

  return (
    <div>
      {currentRoute === 'home' ? <App /> : <AdminPanel />}
    </div>
  );
};

export default Router;
