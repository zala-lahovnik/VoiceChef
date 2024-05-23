import React, {FC, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import SingleRecipeDisplay from "../components/SingleRecipeDisplay/SingleRecipeDisplay";
import {Recipe} from "../utils/recipeTypes";
import {voiceChefApi} from "../utils/axios";
import {Grid} from "@mui/material";
import SideMenu from "../components/SideMenu/SideMenu";


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
    <Grid container sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      maxHeight: '100%',
      height: {xs: '50vh', sm: '95vh', md: '100vh'}
    }}>
      <Grid item xs={1} sx={{height: '100%'}}>
        <SideMenu />
      </Grid>
      <Grid item xs={11} sx={{overflowY: 'scroll', height: '100%', paddingBottom: 8, paddingTop: 3}}>
        {recipe && <SingleRecipeDisplay key={recipe._id} recipe={recipe} />}
      </Grid>
    </Grid>
  )
}

export default SingleRecipePage