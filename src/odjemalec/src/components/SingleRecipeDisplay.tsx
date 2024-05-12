import React, {FC} from "react";
import {Recipe} from "../utils/recipeTypes";
import {Grid, Typography} from "@mui/material";


type RecipeDisplayProps = {
  recipe: Recipe
}

const SingleRecipeDisplay:FC<RecipeDisplayProps> = ({recipe}) => {

  return (
    <Grid container sx={{display: 'flex', padding: 10}}>
      <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
        <img src={recipe.img} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant={'h2'}>
          {recipe.title}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant={'h4'}>
          Koraki
        </Typography>
        {recipe.steps.map((step) => {
          return (
            <Grid container style={{fontSize: '18px', display: 'flex', flexDirection: 'row', marginBottom: '8px'}}>
              <Grid item style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{
                  marginRight: '8px',
                  backgroundColor: '#d17a22',
                  padding: '5px 10px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  width: 'fit-content'
                }}>
                  {step.step}.
                </div>
                <div>
                  {step.text}
                </div>
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}

export default SingleRecipeDisplay