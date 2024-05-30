import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SingleRecipeDisplay from "../components/SingleRecipeDisplay/SingleRecipeDisplay";
import { Recipe } from "../utils/recipeTypes";
import voiceChefApi from "../utils/axios";
import {Grid, Button, Box, Drawer} from "@mui/material";
import SideMenu from "../components/SideMenu/SideMenu";
import {useResponsive} from "../hooks/responsive";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {useAuth0} from "@auth0/auth0-react";

type SingleRecipePageProps = {}

const SingleRecipePage: FC<SingleRecipePageProps> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Array<Recipe> | null>(null);
  const responsive = useResponsive('up', 'lg')
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [userFavorites, setUserFavorites] = useState<Array<string>>([])
  const { user } = useAuth0()

  const fetchRecipes = async () => {
    const result = await voiceChefApi.get('/recipes');
    const recipes = result.data;
    setRecipes(recipes);
    const found = recipes.find((tempRecipe: Recipe) => tempRecipe._id === id);
    if (found) setRecipe(found);
  };

  const updateFavorites = (recipeId: string) => {
    let tempUserFavorites = JSON.parse(JSON.stringify(userFavorites))

    const recipeIndex = tempUserFavorites.indexOf(recipeId);

    console.log('recipeId', recipeId)
    console.log('recipeIndex', recipeIndex)

    if (recipeIndex > -1) {
      tempUserFavorites.splice(recipeIndex, 1);
    } else {
      tempUserFavorites.push(recipeId);
    }

    console.log('tempUserFavorites', tempUserFavorites)

    setUserFavorites(tempUserFavorites)
  }

  const fetchUserFavorites = async () => {
    const response = await voiceChefApi.get(`/favorites/${user?.sub || ''}`)

    if (response.data) {
      setUserFavorites(response.data.favorites)
    }
  }

  useEffect(() => {
    if (user) fetchUserFavorites()
    if (recipes == null) fetchRecipes();
    else {
      const found = recipes.find((tempRecipe: Recipe) => tempRecipe._id === id);
      if (found) setRecipe(found);
    }
  }, [id]);


  return (
    <Grid container sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      maxHeight: '100%',
      height: { xs: '50vh', sm: '95vh', lg: '100vh' }
    }}>
      {responsive ?
        <Grid item xs={12} lg={1} sx={{height: {xs: '0%', lg: '100%'}}}>
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

      <Grid item xs={12} lg={11} sx={{ overflowY: responsive ? 'scroll' : 'none', height: '100%', paddingBottom: 8, paddingTop: 3 }}>
        {recipe && (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <SingleRecipeDisplay key={recipe._id} recipe={recipe} isFavorited={userFavorites.includes(recipe._id)} updateFavoritesFromProps={updateFavorites} />
          </Box>
        )}
      </Grid>
    </Grid>
  )
}

export default SingleRecipePage;