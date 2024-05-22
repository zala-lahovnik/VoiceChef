import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Logout: React.FC = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout();
    window.location.href = window.location.origin;
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
