import React from 'react';
import './App.css';
import RecipesPage from "./pages/RecipesPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SingleRecipePage from "./pages/SingleRecipePage";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<RecipesPage />}/>
          <Route path="/recipe/:id" element={<SingleRecipePage />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
