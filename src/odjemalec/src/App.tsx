import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SingleRecipePage from './pages/SingleRecipePage';
import { useAuth0 } from '@auth0/auth0-react';
import RecipesPage from "./pages/RecipesPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import ProfilePage from "./pages/ProfilePage";
import axios from 'axios';
import AddRecipe from "./pages/AddRecipe";
import EditRecipePage from './pages/EditRecipePage';
import PickAndChoosePage from "./pages/PickAndChoosePage";
import { initKeyboardShortcuts, cleanupKeyboardShortcuts } from './keyboard-shortcuts';



const App: React.FC = () => {
  const { isLoading, isAuthenticated, loginWithRedirect, getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    initKeyboardShortcuts();
    return () => {
      cleanupKeyboardShortcuts();
    };
  }, []);

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
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, getAccessTokenSilently]);


  useEffect(() => {
    const saveUser = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (token && user) {
          await axios.post('http://localhost:5000/auth/register', {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('User saved to backend');
        }
      } catch (error) {
        console.error('Error saving user:', error);
      }
    };

    if (isAuthenticated && user) {
      saveUser();
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipe/:id" element={<SingleRecipePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipePage />} />
          <Route path="/pick-and-choose" element={<PickAndChoosePage />} />
        </Routes>
    </Router>
  );
};

export default App;
