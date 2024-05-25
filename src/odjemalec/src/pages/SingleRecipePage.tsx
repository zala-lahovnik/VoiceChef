import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SingleRecipeDisplay from "../components/SingleRecipeDisplay/SingleRecipeDisplay";
import { Recipe } from "../utils/recipeTypes";
import voiceChefApi from "../utils/axios";
import { Grid, Button, Box } from "@mui/material";
import SideMenu from "../components/SideMenu/SideMenu";

type SingleRecipePageProps = {}

const SingleRecipePage: FC<SingleRecipePageProps> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Array<Recipe> | null>(null);

  const fetchRecipes = async () => {
    const result = await voiceChefApi.get('/recipes');
    const recipes = result.data;
    setRecipes(recipes);
    const found = recipes.find((tempRecipe: Recipe) => tempRecipe._id === id);
    if (found) setRecipe(found);
  };

  useEffect(() => {
    if (recipes == null) fetchRecipes();
    else {
      const found = recipes.find((tempRecipe: Recipe) => tempRecipe._id === id);
      if (found) setRecipe(found);
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await voiceChefApi.delete(`/recipes/${id}`);
      navigate('/'); // Redirect to the homepage after deletion
    } catch (error) {
      console.error('Error deleting recipe', error);
    }
  };

  return (
    <Grid container sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      maxHeight: '100%',
      height: { xs: '50vh', sm: '95vh', md: '100vh' }
    }}>
      <Grid item xs={1} sx={{ height: '100%' }}>
        <SideMenu />
      </Grid>
      <Grid item xs={11} sx={{ overflowY: 'scroll', height: '100%', paddingBottom: 8, paddingTop: 3 }}>
        {recipe && (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <SingleRecipeDisplay key={recipe._id} recipe={recipe} />
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', marginBottom: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#c17c37',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#b56929',
                  },
                  marginTop: 2,
                  marginBottom: 4 // Add margin under the button
                }}
                onClick={handleDelete}
              >
                Delete Recipe
              </Button>
            </Box>
          </Box>
        )}
      </Grid>
    </Grid>
  )
}

export default SingleRecipePage;