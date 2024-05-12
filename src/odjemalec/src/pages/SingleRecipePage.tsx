import React, {FC, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import SingleRecipeDisplay from "../components/SingleRecipeDisplay";
import {Recipe} from "../utils/recipeTypes";
import {voiceChefApi} from "../utils/axios";
import {Grid} from "@mui/material";


type SingleRecipePageProps = {}

const SingleRecipePage:FC<SingleRecipePageProps> = () => {
  const {id} = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [recipes, setRecipes] = useState<Array<Recipe> | null>(null)

  const fetchRecipes = async () => {
    const result = await voiceChefApi.get('/recipes');

    const recipes = result.data

    setRecipes(recipes)

    const found = recipes.find((tempRecipe: Recipe) => tempRecipe._id === id)

    if(found)
      setRecipe(found)
  }

  useEffect(() => {
    if (recipes == null)
      fetchRecipes()
    else {
      const found = recipes.find((tempRecipe: Recipe) => tempRecipe._id === id)

      if(found)
        setRecipe(found)
    }
  }, [id])

  return (
    <Grid container>
      {recipe && <SingleRecipeDisplay recipe={recipe} />}
    </Grid>
  )
}

export default SingleRecipePage