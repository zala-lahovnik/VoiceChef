import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = process.env.REACT_APP_AUTH0_DOMAIN!;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID!;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE!;
const redirectUri = window.location.origin;

console.log('Auth0Provider Config:', { domain, clientId, redirectUri, audience });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
        scope: 'openid profile email read:users update:users delete:users create:users read:messages',
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
reportWebVitals();
