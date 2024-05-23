import { Grid, Typography, Button, Box } from "@mui/material";
import SideMenu from "../components/SideMenu/SideMenu";
import React, { useEffect, useState } from "react";
import { Recipe } from "../utils/recipeTypes";
import voiceChefApi from "../utils/axios";
import { useNavigate } from "react-router-dom";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
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

  const handleDelete = async (id: string) => {
    try {
      await voiceChefApi.delete(`/recipes/${id}`);
      fetchRecipes(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting recipe', error);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-recipe/${id}`);
  };

  const handleAddNewRecipe = () => {
    navigate('/add-recipe');
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
      <Grid item xs={11} sx={{ overflowY: 'scroll', height: '100%', paddingBottom: 8, paddingTop: 3, paddingLeft: 2, paddingRight: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Typography variant="h4" gutterBottom>
            Recipe List
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#c17c37',
              color: 'white',
              '&:hover': {
                backgroundColor: '#b56929',
              },
            }}
            onClick={handleAddNewRecipe}
          >
            Add New Recipe
          </Button>
        </Box>
        <Grid container spacing={2}>
          {recipes.map((recipe) => (
            <Grid item xs={12} key={recipe._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 2, paddingRight: 2 }}>
              <Typography variant="h6">{recipe.title}</Typography>
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#c17c37',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#b56929',
                    },
                    marginRight: 1,
                  }}
                  onClick={() => handleEdit(recipe._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#c17c37',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#b56929',
                    },
                  }}
                  onClick={() => handleDelete(recipe._id)}
                >
                  Delete
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RecipesPage;