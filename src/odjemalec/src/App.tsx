import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RecipesPage from './pages/RecipesPage';
import SingleRecipePage from './pages/SingleRecipePage';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './components/Login';
import Logout from './components/Logout'; // Importajte komponento Logout

const App: React.FC = () => {
  const { isLoading, isAuthenticated, loginWithRedirect, getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE!,
            scope: 'openid profile email read:users update:users delete:users create:users read:messages',
          },
        });
        setAccessToken(token);
        sessionStorage.setItem('accessToken', token); // Shranimo dostopni žeton
        console.log('Access token:', token);
      } catch (error) {
        console.error('Error getting access token', error);
      }
    };

    if (isAuthenticated) {
      getToken();
    } else if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, getAccessTokenSilently]);

  useEffect(() => {
    console.log('User:', user);
  }, [user]);

  console.log('isLoading:', isLoading);
  console.log('isAuthenticated:', isAuthenticated);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {/*<div>*/}
        {/*{isAuthenticated && <Logout />} /!* Pokaži gumb za odjavo, če je uporabnik avtenticiran *!/*/}
        <Routes>
          <Route path="/" element={<RecipesPage />} />
          <Route path="/recipe/:id" element={<SingleRecipePage />} />
        </Routes>
        {/*<div>*/}
        {/*  <h3>Debug Info:</h3>*/}
        {/*  <p>isLoading: {isLoading.toString()}</p>*/}
        {/*  <p>isAuthenticated: {isAuthenticated.toString()}</p>*/}
        {/*  <p>Access Token: {accessToken}</p>*/}
        {/*  <p>User: {user ? JSON.stringify(user) : 'No user'}</p>*/}
        {/*</div>*/}
      {/*</div>*/}
    </Router>
  );
};

export default App;
