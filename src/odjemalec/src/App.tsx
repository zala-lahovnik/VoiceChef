import React from 'react';
import './App.css';
import RecipesPage from "./pages/RecipesPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<RecipesPage />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
