import React, {FC} from "react";
import {Recipe} from "../../utils/recipeTypes";
import {Box, Grid, Typography} from "@mui/material";
import FavoritesDisplay from "../FavoritesDisplay/FavoritesDisplay";
import {useAuth0} from "@auth0/auth0-react";


type RecipeDisplayProps = {
  recipe: Recipe,
  isFavorited: boolean,
  updateFavoritesFromProps: (recipeId: string) => void
}

const RecipeDisplay:FC<RecipeDisplayProps> = ({recipe, isFavorited, updateFavoritesFromProps}) => {
  const { user } = useAuth0()

  return (
    <Grid container sx={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1F1D2B',
      borderRadius: '16px',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Grid sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: user ? 0 : 2}}>
        <Box sx={{
          padding: '12px',
          background: 'radial-gradient(circle at 100%, #3f2e20, #563f2d 50%, #2a1e15)',
          top: '-50%',
          borderRadius: '100%',
          border: '2px solid #3f2e20',
          backgroundColor: '#2a1e15',
          transform: 'translate(0%, -25%)'
        }}>
          <img src={recipe.img} style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '1px solid #3f2e20'
          }} />
        </Box>
        <Box sx={{fontWeight: 700, fontSize: '18px', padding: 1, paddingTop: 0, position: 'relative', letterSpacing: '1px'}}>
          <div style={{backgroundColor: '#d17a22', borderRadius: '8px', width: 'fit-content', padding: '4px 8px', color: 'white'}}>
            {recipe.category}
          </div>
        </Box>
        <Typography sx={{fontSize: '24px', padding: 1, textAlign: 'center', color: '#fff'}}>
          {recipe.title}
        </Typography>
      </Grid>
      {user &&
          <Grid sx={{marginBottom: 2, display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
              <FavoritesDisplay isFavorited={isFavorited} recipeId={recipe._id} updateFavoritesFromProps={updateFavoritesFromProps} />
          </Grid>
      }

    </Grid>
  )
}

export default RecipeDisplay