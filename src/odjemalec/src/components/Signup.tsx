import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Signup: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignup = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  };

  return (
    <div>
      <h2>Create an account to get started</h2>
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
