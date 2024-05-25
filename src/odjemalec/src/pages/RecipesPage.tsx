import { Grid, Typography, Button, Box } from "@mui/material";
import SideMenu from "../components/SideMenu/SideMenu";
import React, { useEffect, useState } from "react";
import { Recipe } from "../utils/recipeTypes";
import voiceChefApi from "../utils/axios";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

      <Grid item xs={11} sx={{
        overflowY: 'scroll',
        height: '100%',
        padding: 10,
        maxHeight: '100%',
      }}>
        <Grid sx={{backgroundColor: '#1F1D2B', padding: 10, borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Typography variant="h4">
              Recipe List
            </Typography>
            <IconButton
              sx={{
                backgroundColor: '#c17c37',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#b56929',
                },
              }}
              onClick={handleAddNewRecipe}
            >
              <AddIcon sx={{fontSize: '36px'}} />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            {recipes.map((recipe) => (
              <Grid item xs={12} key={recipe._id} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Typography
                  onClick={() => {navigate(`/recipe/${recipe._id}`)}}
                  variant="h6"
                  sx={{cursor: 'pointer'}}
                >
                  {recipe.title}
                </Typography>

                <Box>
                  <IconButton
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
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      backgroundColor: '#c17c37',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#b56929',
                      },
                    }}
                    onClick={() => handleDelete(recipe._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

      </Grid>
    </Grid>
  );
};

export default RecipesPage;