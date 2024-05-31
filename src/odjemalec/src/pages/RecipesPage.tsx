import {Grid, Typography, Button, Box, Modal, Paper, DialogActions, Drawer, IconButton} from "@mui/material";
import SideMenu from "../components/SideMenu/SideMenu";
import React, { useEffect, useState } from "react";
import { Recipe } from "../utils/recipeTypes";
import voiceChefApi from "../utils/axios";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useResponsive } from "../hooks/responsive";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth0 } from "@auth0/auth0-react";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const responsive = useResponsive('up', 'lg');
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const { user } = useAuth0(); // Get the logged-in user

  const fetchRecipes = async () => {
    try {
      if (user) {
        const result = await voiceChefApi.get(`/recipes/user/${user.sub}`);
        setRecipes(result.data);
      }
    } catch (error) {
      if (Notification.permission === 'granted') {
        new Notification("Error fetching recipes", {
          body: 'Fetching recipes failed. Please try again later.',
          icon: '/icon-144.png'
        });
      }
      console.error('Error fetching recipes', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await voiceChefApi.delete(`/recipes/${id}`);
      fetchRecipes(); // Refresh the list after deletion
      setCurrentRecipe(null);
      setDeleteModalOpen(false);
    } catch (error) {
      if (Notification.permission === 'granted') {
        new Notification("Error deleting recipe", {
          body: 'Deleting recipe failed. Please try again later.',
          icon: '/icon-144.png'
        });
      }
      console.error('Error deleting recipe', error);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-recipe/${id}`);
  };

  const handleAddNewRecipe = () => {
    navigate('/add-recipe');
  };

  const handleClose = () => setDeleteModalOpen(false);

  return (
    <Grid container sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      maxHeight: '100%',
      height: { xs: '100%', sm: '100%', md: '100vh' }
    }}>
      {responsive ?
        <Grid item xs={12} md={1} sx={{height: {xs: '0%', md: '100%'}}}>
          <SideMenu />
        </Grid>
        :
        <Grid
          xs={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            padding: 2,
            backgroundColor: '#1F1D2B',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
          }}
        >
          <IconButton
            onClick={() => {setOpenMenu(true)}}
          >
            <MenuIcon sx={{color: '#fff'}} />
          </IconButton>
          <Drawer
            open={openMenu}
            onClose={() => setOpenMenu(false)}
            PaperProps={{
              sx: {
                backgroundColor: 'transparent',
                width: {
                  xs: '60%',
                  sm: '40%',
                  md: '30%',
                  lg: '20%'
                }
              }
            }}>
            <Box sx={{width: '100%', height: '100%'}}>
              <SideMenu />
            </Box>
          </Drawer>
        </Grid>
      }

      <Grid item xs={12} md={11} sx={{
        overflowY: responsive ? 'scroll' : 'none',
        height: '100%',
        padding: responsive ? 10 : 2,
        maxHeight: '100%',
        marginBottom: 2
      }}>
        <Grid sx={{backgroundColor: '#1F1D2B', padding: responsive ? 10 : 3, borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Typography variant="h4">
              My Recipes
            </Typography>
            <IconButton
              sx={{
                backgroundColor: '#d17a22',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#b56929',
                },
              }}
              onClick={handleAddNewRecipe}
            >
              <AddIcon sx={{fontSize: responsive ? '36px' : '24px'}} />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            {recipes.map((recipe) => (
              <Grid item xs={12} key={recipe._id} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                columnGap: 2
              }}>
                <Typography
                  onClick={() => {navigate(`/recipe/${recipe._id}`)}}
                  variant={responsive ? 'h6': 'subtitle1'}
                  sx={{cursor: 'pointer'}}
                >
                  {recipe.title}
                </Typography>

                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <IconButton
                    sx={{
                      backgroundColor: '#d17a22',
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
                      backgroundColor: '#d17a22',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#b56929',
                      },
                    }}
                    onClick={() => {setCurrentRecipe(recipe); setDeleteModalOpen(true)}}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Modal
        open={deleteModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px 10px'}}
      >
        <Paper sx={{padding: 2, paddingLeft: 4, paddingRight: 4, minWidth: '40%', backgroundColor: '#252836', borderRadius: '16px'}}>
          <Typography id="delete-recipe-modal-title" variant="h6" component="h2" sx={{color: '#fff', paddingBottom: 2}}>
            Delete this recipe?
          </Typography>

          <Typography sx={{color: '#fff'}}>
            {currentRecipe?.title}
          </Typography>

          {currentRecipe &&
          <DialogActions>
            <Button sx={{
              backgroundColor: 'rgb(183, 29, 24)',
              padding: 1,
              paddingLeft: 2,
              paddingRight: 2,
              color: '#fff',
              fontWeight: 700
            }}
                    onClick={() => {handleDelete(currentRecipe?._id)}} autoFocus>
              Delete
            </Button>
            <Button
              sx={{
                backgroundColor: '#757575',
                padding: 1,
                paddingLeft: 2,
                paddingRight: 2,
                color: '#fff',
                fontWeight: 700
              }}
                    onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
          }
        </Paper>
      </Modal>
    </Grid>
  );
};

export default RecipesPage;