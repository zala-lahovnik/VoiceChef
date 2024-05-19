import React, {FC} from "react";
import {Recipe} from "../utils/recipeTypes";
import {Box, Grid, Typography} from "@mui/material";


type RecipeDisplayProps = {
  recipe: Recipe
}

const RecipeDisplay:FC<RecipeDisplayProps> = ({recipe}) => {

  return (
    <Grid container sx={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      borderRadius: 2,
      // padding: 1,
      height: '100%',
      width: '100%',
      boxShadow: '5px 10px 15px #d3d3d3',
      border: '1px solid #d3d3d3'
    }}>
      <img src={recipe.img} style={{
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: '8px'
      }} />
      <Box sx={{fontWeight: 500, fontSize: '18px', padding: 1, position: 'relative'}}>
        <div style={{backgroundColor: '#d17a22', borderRadius: '8px', width: 'fit-content', padding: '4px 8px', color: 'white'}}>
          {recipe.category}
        </div>
      </Box>
      <Typography sx={{fontWeight: 700, fontSize: '24px', padding: 1, marginBottom: 1}}>
        {recipe.title}
      </Typography>
    </Grid>
  )
}

export default RecipeDisplay