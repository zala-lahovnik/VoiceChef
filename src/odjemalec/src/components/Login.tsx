import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <h2>Please log in to access the application</h2>
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  );
};

export default Login;
