import React, { FC, useEffect, useState } from "react";
import { Recipe } from "../utils/recipeTypes";
import voiceChefApi from "../utils/axios";
import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RecipeDisplay from "../components/RecipeDisplay/RecipeDisplay";
import SideMenu from "../components/SideMenu/SideMenu";

type RecipesPageProps = {}

const RecipesPage: FC<RecipesPageProps> = () => {
  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const result = await voiceChefApi.get('/recipes');
      setRecipes(result.data);
    } catch (error) {
      console.error('Error fetching recipes', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleOnClickOnRecipe = (id: string) => {
    navigate(`/recipe/${id}`);
  };

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

      <Grid item xs={11} sx={{overflowY: 'scroll', height: '100%'}}>
        <Grid item xs={12} sx={{marginBottom: 2}}>
          <Typography variant={'h2'} component={'h2'} >Recepti</Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingLeft: '5%',
            paddingRight: '5%',
            rowGap: 4,
            columnGap: 2
          }}>
            {recipes && recipes.map((recipe) => {
              return (
                <Grid key={recipe._id} item xs={12} sm={12} md={4} lg={2} onClick={() => { handleOnClickOnRecipe(recipe._id) }}>
                  <RecipeDisplay recipe={recipe} />
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RecipesPage;
