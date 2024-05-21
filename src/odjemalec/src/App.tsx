import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RecipesPage from './pages/RecipesPage';
import SingleRecipePage from './pages/SingleRecipePage';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        localStorage.setItem('accessToken', token);
      } catch (error) {
        console.error('Error getting access token', error);
      }
    };

    if (!isLoading && isAuthenticated) {
      getToken();
    } else if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <RecipesPage /> : <Navigate to="/" />} />
        <Route path="/recipe/:id" element={isAuthenticated ? <SingleRecipePage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
