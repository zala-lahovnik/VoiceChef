import React, { FC, useEffect, useState } from "react";
import { Recipe } from "../utils/recipeTypes";
import voiceChefApi from "../utils/axios";
import {
  Box,
  FormControl,
  Grid, LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  TextField, Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RecipeDisplay from "../components/RecipeDisplay/RecipeDisplay";
import SideMenu from "../components/SideMenu/SideMenu";
import './recipes-page.css'
import SearchIcon from '@mui/icons-material/Search';

type RecipesPageProps = {}

export const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: '#2D303E',
    borderRadius: '16px',
    '& fieldset': {
      borderColor: '#2D303E',
    },
    '&:hover fieldset': {
      borderColor: '#2D303E',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2D303E',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'white',
    fontWeight: 'bold',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white',
  },
});

export const WhiteSelect = styled(Select)(({ theme }) => ({
  color: 'white',
  borderRadius: '16px',
  backgroundColor: '#2D303E',
  fontWeight: 'bold',
  letterSpacing: '2px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2D303E',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2D303E',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2D303E',
  },
  '& .MuiInputLabel-root': {
    color: '#2D303E',
    fontWeight: 'bold',
  },
  '&.Mui-focused .MuiInputLabel-root': {
    color: '#2D303E',
  },
  '& .MuiSvgIcon-root': {
    color: '#2D303E',
  },
}));


const HomePage: FC<RecipesPageProps> = () => {
  const [recipes, setRecipes] = useState<Array<Recipe> | null>(null);
  const [categories, setCategories] = useState<Array<string>>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('--')
  const navigate = useNavigate();
  const [filteredRecipes, setFilteredRecipes] = useState<Array<Recipe> | null>(null)
  const [searchPrompt, setSearchPrompt] = useState<string>('')

  
  const fetchRecipes = async () => {
    try {
      const result = await voiceChefApi.get('/recipes');
      console.log('API response:', result.data);
      setRecipes(result.data);
      setFilteredRecipes(result.data)

      const tempCategoriesArray = result.data.map((recipe: Recipe) => {
        return recipe.category
      })

      const uniqueArray = tempCategoriesArray.reduce((accumulator: Array<string>, currentValue: string) => {
        if (!accumulator.includes(currentValue)) {
          accumulator.push(currentValue);
        }
        return accumulator;
      }, []);

      setCategories(uniqueArray)
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

  const handleCategoryChange = (event: SelectChangeEvent<unknown>) => {
    setSelectedCategory(event.target.value as string);
  }

  useEffect(() => {
    if(recipes) {
      let tempFilteredArray = recipes
      if (selectedCategory !== '--')
        tempFilteredArray = tempFilteredArray.filter((filteredRecipe: Recipe) => filteredRecipe.category === selectedCategory)

      if (searchPrompt !== '') {
        tempFilteredArray = tempFilteredArray.filter((filteredRecipe: Recipe) => filteredRecipe.title.toLowerCase().includes(searchPrompt.toLowerCase()))
      }

      setFilteredRecipes(tempFilteredArray)
    }
  }, [selectedCategory, searchPrompt])

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

      <Grid item xs={11} sx={{overflowY: 'scroll', height: '100%', paddingBottom: 8, paddingTop: 3}}>
        <Grid item xs={12} sx={{
          marginBottom: 2,
        }}>
          <Grid item xs={12} sx={{display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            columnGap: 3
          }}>
            <Grid item xs={8}>
              <FormControl fullWidth>
                <StyledTextField
                  id="search-bar"
                  label="Find something you like ..."
                  variant="outlined"
                  sx={{ style: {color: '#fff'}, borderRadius: '16px'}}
                  value={searchPrompt}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchPrompt(event.target.value);
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <FormControl fullWidth>
                {/*<WhiteInputLabel id="category-select-label" sx={{ color: 'white' }}>Category</WhiteInputLabel>*/}
                <WhiteSelect
                  // labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                  sx={{color: '#fff', borderColor: '#fff'}}
                >
                  <MenuItem value={'--'}>
                    Choose a category
                  </MenuItem>
                  {categories.map((categoryItem: string) => {
                    return (
                      <MenuItem value={categoryItem}>
                        {categoryItem}
                      </MenuItem>
                    )
                  })}
                </WhiteSelect>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingLeft: '5%',
            paddingRight: '5%',
            rowGap: 15,
            columnGap: 2,
            paddingTop: '150px'
          }}>
            {filteredRecipes && filteredRecipes.map((recipe) => {
              return (
                <Grid key={recipe._id} item xs={12} sm={12} md={4} lg={2} onClick={() => { handleOnClickOnRecipe(recipe._id) }} sx={{cursor: 'pointer'}}>
                  <RecipeDisplay recipe={recipe} />
                </Grid>
              )
            })}
            {!filteredRecipes ?
              <Box sx={{width: '100%', marginTop: 5}}>
                <LinearProgress  sx={{
                  backgroundColor: '#252836',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#b56929'
                  }}}
                />
              </Box>
              :
              filteredRecipes.length === 0 &&
                <Typography variant={'h5'}>
                  No recipes found.
                </Typography>
            }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
