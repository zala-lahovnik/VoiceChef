import React, {FC, useEffect, useState} from "react";
import RecipeDisplay from "../components/RecipeDisplay";
import {Recipe} from "../utils/recipeTypes";
import {voiceChefApi} from "../utils/axios";


type RecipesPageProps = {}


const RecipesPage:FC<RecipesPageProps> = () => {
  const [recipes, setRecipes] = useState<Array<Recipe>>([])

  const fetchRecipes = async () => {
    const result = await voiceChefApi.get('/recipes');

    console.log('result', result)

    const recipes = result.data

    setRecipes(recipes)
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  return (
    <>
      <h1>Recepti</h1>
      <br />

      {recipes && recipes.map((recipe) => {
        return <RecipeDisplay recipe={recipe} />
      })}

    </>
  )
}

export default RecipesPage