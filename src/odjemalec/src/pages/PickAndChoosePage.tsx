import React, {FC, useEffect, useState} from "react";
import voiceChefApi from "../utils/axios";
import {Recipe, RecipeIngredient} from "../utils/recipeTypes";
import {FormControl, Grid, Typography} from "@mui/material";
import SideMenu from "../components/SideMenu/SideMenu";
import {StyledTextField} from "./HomePage";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import EggAltIcon from '@mui/icons-material/EggAlt';
import DeleteIcon from "@mui/icons-material/Delete";
import {useNavigate} from "react-router-dom";
import PickAndChooseRecipeDisplay from "../components/PickAndChooseRecipeDisplay/PickAndChooseRecipeDisplay";

type PickAndChoosePageProps = {

}

const PickAndChoosePage:FC<PickAndChoosePageProps> = () => {
  const navigation = useNavigate()
  const [recipes, setRecipes] = useState<Array<Recipe> | null>(null);
  const [filteredRecipes, setFilteredRecipes] = useState<Array<Recipe> | null>(null)
  const [currentUnit, setCurrentUnit] = useState<string>('')
  const [currentQuantity, setCurrentQuantity] = useState<number>(0)
  const [currentItemName, setCurrentItemName] = useState<string>('')
  const [ingredients, setIngredients] = useState<Array<RecipeIngredient>>([])
  const [addedIngredient, setAddedIngredient] = useState<RecipeIngredient>({_id: '', quantity: 0, unit: '', description: ''})

  const fetchRecipes = async () => {
    try {
      const result = await voiceChefApi.get('/recipes')
      setRecipes(result.data)
      setFilteredRecipes(result.data)
    } catch (error) {
      console.error('Error fetching recipes', error)
    }
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  console.log('added', addedIngredient)

  const handleAddNewItem = () => {
    const newItem = {_id: ingredients.length.toString(), quantity: currentQuantity, unit: currentUnit, description: currentItemName}

    ingredients.push(newItem)

    setCurrentItemName('')
    setCurrentUnit('')
    setCurrentQuantity(0)
  }

  const deleteSelectedIngredient = (id: string) => {
    const tempIngredients = ingredients.filter((oneIngredient: RecipeIngredient) => oneIngredient._id !== id)

    tempIngredients.forEach((oneIngredient: RecipeIngredient, index) => {
      oneIngredient._id = index.toString()
    })

    setIngredients(tempIngredients)
  }

  const canMakeRecipe = (recipe: Recipe, userIngredients:Array<RecipeIngredient>) => {
    const userIngredientsDict = userIngredients.reduce((acc: any, ingredient: RecipeIngredient) => {
      acc[ingredient.description] = ingredient;
      return acc;
    }, {});

    for (let recipeIngredient of recipe.ingredients) {
      const userIngredient = userIngredientsDict[recipeIngredient.description];
      if (!userIngredient) return false;
      if (userIngredient.unit !== recipeIngredient.unit) return false;
      if (userIngredient.quantity < recipeIngredient.quantity) return false;
    }

    return true;
  };


  console.log('ingredients', ingredients)

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

      <Grid item xs={11}
        sx={{
          overflowY: 'scroll',
          height: '100%',
          paddingBottom: 8,
          paddingTop: 3,
          display: 'flex',
          flexDirection: 'column',
          padding: 8,
          columnGap: 4
        }}
      >
        <Typography variant={'h4'} sx={{marginBottom: 6, textAlign: 'center'}}>
          Recipe Roulette: What Can You Cook Today?
        </Typography>

        <Grid sx={{display: 'flex', flexDirection: 'row'}}>
          <Grid item xs={3} sx={{backgroundColor: '#1F1D2B', padding: 2, borderRadius: '16px'}}>
            {ingredients.length > 0 ? ingredients.map((ingredient: RecipeIngredient) => {
              return (
                <Grid xs={12} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Grid xs={10} sx={{display: 'flex', flexDirection: 'row', padding: 2, columnGap: 2}}>
                    <EggAltIcon sx={{color: '#fff'}} />
                    <Typography>
                      {ingredient.description}, {ingredient.quantity} {ingredient.unit}
                    </Typography>
                  </Grid>
                  <Grid xs={2} sx={{display: 'flex', flexDirection: 'row'}}>
                    <IconButton
                      sx={{
                        backgroundColor: '#d17a22',
                        color: 'white'
                      }}
                      onClick={() => {deleteSelectedIngredient(ingredient._id)}}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>

                </Grid>
              )
            })
            :
              <Grid sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography sx={{textAlign: 'center', justifyContent: 'center'}}>
                  No ingredients added yet.
                </Typography>
              </Grid>

            }
          </Grid>

          <Grid item xs={9}>
            <FormControl fullWidth
               sx={{
                 display: 'flex',
                 flexDirection: 'row',
                 columnGap: 6,
                 justifyContent: 'center',
                 alignItems: 'center',
                 paddingLeft: 4,
                 paddingRight: 4,
                 marginBottom: 4
               }}>
              <StyledTextField
                label='Ingredient'
                onChange={(e) => setCurrentItemName(e.target.value)}
                variant="outlined"
                placeholder="Ingredient"
                value={currentItemName}
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  style: {
                    color: 'white',
                    borderColor: 'white',
                  },
                }}
                sx={{width: '39%'}}
              />
              <StyledTextField
                label={'Item quantity'}
                onChange={(e) => setCurrentQuantity(parseInt(e.target.value))}
                type='number'
                placeholder="Item quantity"
                value={currentQuantity}
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  style: {
                    color: 'white',
                    borderColor: 'white',
                  },
                }}
                sx={{width: '50%'}}
              />
              <StyledTextField
                label='Unit'
                onChange={(e) => setCurrentUnit(e.target.value)}
                variant="outlined"
                placeholder="Unit"
                value={currentUnit}
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  style: {
                    color: 'white',
                    borderColor: 'white',
                  },
                }}
                sx={{width: '39%'}}
              />
              <Grid>
                <IconButton
                  sx={{
                    backgroundColor: '#d17a22',
                    color: 'white'
                  }}
                  onClick={handleAddNewItem}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </FormControl>

            <Grid xs={12} sx={{paddingTop: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
              {ingredients.length === 0 ?
                <Typography variant={'h5'} sx={{textAlign: 'center'}}>
                  Please select your ingredients
                </Typography>
                :
                <Grid>
                  { recipes && recipes.map((recipe, index) => (
                    <>
                      {canMakeRecipe(recipe, ingredients) ?
                        <Grid onClick={() => {navigation(`/recipe/${recipe._id}`)}} sx={{cursor: 'pointer'}}>
                          <PickAndChooseRecipeDisplay recipe={recipe} />
                        </Grid>
                        :
                        ''}
                    </>
                  ))}
                </Grid>
              }
            </Grid>
          </Grid>

        </Grid>
      </Grid>

    </Grid>
  )
}

export default PickAndChoosePage