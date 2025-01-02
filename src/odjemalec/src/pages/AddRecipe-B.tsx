import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  IconButton, Drawer, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/system';
import voiceChefApi from '../utils/axios';
import './AddRecipe.css';
import SideMenu from "../components/SideMenu/SideMenu";
import { StyledTextField } from "./HomePage";
import MenuIcon from "@mui/icons-material/Menu";
import { useResponsive } from "../hooks/responsive";
import { useAuth0 } from "@auth0/auth0-react"; // Import useAuth0

export interface Time {
  label: string;
  time: string;
}

export interface Ingredient {
  quantity: number;
  unit: string;
  description: string;
}

export interface Step {
  step: number;
  text: string;
}

export interface RecipeData {
  userId?: string; // Make userId optional
  title: string;
  category: string;
  times: Time[];
  numberOfPeople: string;
  ingredients: Ingredient[];
  steps: Step[];
  img: string;
}

export const Title = styled(Typography)({
  textAlign: 'center',
  marginBottom: '20px',
  color: '#fff',
});

export const CustomButton = styled(Button)({
  backgroundColor: '#d17a22',
  color: 'white',
  borderRadius: '16px',
  padding: '8px 12px',
  width: 'fit-content',
  alignSelf: 'center',
  '&:hover': {
    backgroundColor: '#b56929',
    filter: 'drop-shadow(0px 8px 24px rgba(234, 124, 105, 0.32))'
  },
});

export const CustomIconButton = styled(IconButton)({
  color: '#fff',
  backgroundColor: '#d17a22',
  '&:hover': {
    backgroundColor: '#b56929',
    filter: 'drop-shadow(0px 8px 24px rgba(234, 124, 105, 0.32))'
  },
});

export const DynamicField = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px',
});

const AddRecipeB: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth0(); // Get the logged-in user

  const [recipeData, setRecipeData] = useState<RecipeData>({
    userId: user?.sub || '', // Initialize with user ID if available
    title: '',
    category: '',
    times: [{ label: '', time: '' }],
    numberOfPeople: '',
    ingredients: [{ quantity: 0, unit: '', description: '' }],
    steps: [{ step: 1, text: '' }],
    img: ''
  });

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const responsive = useResponsive('up', 'lg');

  useEffect(() => {
    const syncOfflineRecipes = async () => {
      const offlineRecipes = JSON.parse(localStorage.getItem('offlineRecipes') || '[]');
      if (offlineRecipes.length > 0) {
        for (const recipe of offlineRecipes) {
          try {
            await voiceChefApi.post('/recipes', recipe);
          } catch (error) {
            if (Notification.permission === 'granted') {
              new Notification("Error syncing recipes", {
                body: 'Syncing recipes failed. Please try again later.',
                icon: '/icon-144.png'
              });
            }
            console.error('Error syncing recipe', error);
          }
        }
        localStorage.removeItem('offlineRecipes');
        alert('Offline recipes synced successfully!');
      }
    };

    window.addEventListener('online', syncOfflineRecipes);
    return () => {
      window.removeEventListener('online', syncOfflineRecipes);
    };
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof RecipeData,
    index?: number,
    subField?: string
  ) => {
    const { name, value } = e.target;
    setRecipeData((prevData) => {
      if (index !== undefined && subField) {
        const updatedField = [...(prevData[field] as any)];
        if (subField in updatedField[index]) {
          updatedField[index][subField] = value;
          return { ...prevData, [field]: updatedField };
        }
      }
      return { ...prevData, [field]: value };
    });
  };

  const handleAddField = (field: keyof RecipeData) => {
    setRecipeData((prevData) => {
      const updatedField = [...(prevData[field] as any)];
      if (field === 'times') updatedField.push({ label: '', time: '' });
      if (field === 'ingredients') updatedField.push({ quantity: 0, unit: '', description: '' });
      if (field === 'steps') updatedField.push({ step: updatedField.length + 1, text: '' });
      return { ...prevData, [field]: updatedField };
    });
  };

  const handleRemoveField = (field: keyof RecipeData, index: number) => {
    setRecipeData((prevData) => {
      const updatedField = [...(prevData[field] as any)];
      updatedField.splice(index, 1);
      return { ...prevData, [field]: updatedField };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await voiceChefApi.post('/recipes', recipeData);
      navigate('/recipes');
    } catch (error) {
      if (Notification.permission === 'granted') {
        new Notification("Error adding recipe", {
          body: 'Adding recipe failed. Please try again later.',
          icon: '/icon-144.png'
        });
      }
      console.error('Error adding recipe', error);
      saveRecipeOffline(recipeData);
      navigate('/');
    }
  };

  const saveRecipeOffline = (recipeData: RecipeData) => {
    let offlineRecipes = JSON.parse(localStorage.getItem('offlineRecipes') || '[]');
    offlineRecipes.push(recipeData);
    localStorage.setItem('offlineRecipes', JSON.stringify(offlineRecipes));
    alert('Recipe saved locally. It will be synced when you go back online.');
  };

  return (
    <Grid container sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      maxHeight: '100%',
      height: { xs: '100%', sm: '100%', lg: '100vh' }
    }}>
      {responsive ?
        <Grid item xs={12} lg={1} sx={{height: {xs: '0%', lg: '100%'}}}>
          <SideMenu />
        </Grid>
        :
        <Grid
          item
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

      <Grid item xs={12} lg={11} sx={{
        display: 'flex',
        padding: responsive ? 10 : 2,
        overflowY: responsive ? 'scroll' : 'none',
        height: '100%',
        maxHeight: '100%'
      }}>
        <Grid item xs={12} sx={{
          backgroundColor: '#1F1D2B',
          display: 'flex',
          flexDirection: 'column',
          padding: responsive ? 12 : 2,
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: '16px',
          height: 'fit-content'
        }}>
          <Title variant="h4">Add a New Recipe</Title>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
            <FormControl fullWidth sx={{
              display: 'flex',
              flexDirection: responsive ? 'row' : 'column',
              columnGap: 4
            }}>
              <StyledTextField
                label="Title"
                name="title"
                value={recipeData.title}
                onChange={(e) => handleInputChange(e, 'title')}
                margin="normal"
                sx={{width: responsive ? '60%' : '100%'}}
              />
              <StyledTextField
                label="Number of People"
                name="numberOfPeople"
                type="number"
                value={recipeData.numberOfPeople}
                onChange={(e) => handleInputChange(e, 'numberOfPeople')}
                sx={{width: responsive ? '10%' : '100%'}}
                margin="normal"
              />
              <StyledTextField
                label="Category"
                name="category"
                value={recipeData.category}
                onChange={(e) => handleInputChange(e, 'category')}
                sx={{width: responsive ? '30%' : '100%'}}
                margin="normal"
              />
            </FormControl>

            <Typography variant={'h5'} sx={{paddingTop: 2}}>
              Food preparation times
            </Typography>
            {recipeData.times.map((time, index) => (
              <DynamicField key={index} sx={{
                display: 'flex',
                flexDirection: responsive ? 'row' : 'column'
              }}>
                <StyledTextField
                  label={`Time ${index + 1} Label`}
                  name="label"
                  value={time.label}
                  onChange={(e) => handleInputChange(e, 'times', index, 'label')}
                  fullWidth
                  margin="normal"
                />
                <StyledTextField
                  label={`Time ${index + 1}`}
                  name="time"
                  value={time.time}
                  onChange={(e) => handleInputChange(e, 'times', index, 'time')}
                  fullWidth
                  margin="normal"
                />
                <Box sx={responsive ?
                  {display: 'flex', flexDirection: 'row', columnGap: 1}
                  :
                  {display: 'flex', justifyContent: 'space-between', width: '100%'}
                }>
                  <CustomIconButton sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} } onClick={() => handleAddField('times')}><AddIcon /></CustomIconButton>
                  <CustomIconButton
                    sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} }
                    onClick={() => handleRemoveField('times', index)}
                    disabled={recipeData.times.length === 1}
                  >
                    <RemoveIcon />
                  </CustomIconButton>
                </Box>
              </DynamicField>
            ))}

            <Typography variant={'h5'} sx={{paddingTop: 2}}>
              Ingredients needed
            </Typography>
            {recipeData.ingredients.map((ingredient, index) => (
              <DynamicField key={index} sx={{
                display: 'flex',
                flexDirection: responsive ? 'row' : 'column'
              }}>
                <StyledTextField
                  label={`Ingredient ${index + 1} Quantity`}
                  name="quantity"
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => handleInputChange(e, 'ingredients', index, 'quantity')}
                  fullWidth
                  margin="normal"
                />
                <StyledTextField
                  label={`Ingredient ${index + 1} Unit`}
                  name="unit"
                  value={ingredient.unit}
                  onChange={(e) => handleInputChange(e, 'ingredients', index, 'unit')}
                  fullWidth
                  margin="normal"
                />
                <StyledTextField
                  label={`Ingredient ${index + 1} Description`}
                  name="description"
                  value={ingredient.description}
                  onChange={(e) => handleInputChange(e, 'ingredients', index, 'description')}
                  fullWidth
                  margin="normal"
                />
                <Box sx={responsive ?
                  {display: 'flex', flexDirection: 'row', columnGap: 1}
                  :
                  {display: 'flex', justifyContent: 'space-between', width: '100%'}
                }>
                  <CustomIconButton sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} } onClick={() => handleAddField('ingredients')}><AddIcon /></CustomIconButton>
                  <CustomIconButton
                    sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} }
                    onClick={() => handleRemoveField('ingredients', index)}
                    disabled={recipeData.ingredients.length === 1}
                  >
                    <RemoveIcon />
                  </CustomIconButton>
                </Box>
              </DynamicField>
            ))}

            <Typography variant={'h5'} sx={{paddingTop: 2}}>
              Recipe steps
            </Typography>
            {recipeData.steps.map((step, index) => (
              <DynamicField key={index} sx={{
                display: 'flex',
                flexDirection: responsive ? 'row' : 'column'
              }}>
                <StyledTextField
                  label={`Step ${index + 1}`}
                  name="text"
                  value={step.text}
                  onChange={(e) => handleInputChange(e, 'steps', index, 'text')}
                  fullWidth
                  margin="normal"
                />
                <Box sx={responsive ?
                  {display: 'flex', flexDirection: 'row', columnGap: 1}
                  :
                  {display: 'flex', justifyContent: 'space-between', width: '100%'}
                }>
                  <CustomIconButton sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} } onClick={() => handleAddField('steps')}><AddIcon /></CustomIconButton>
                  <CustomIconButton
                    sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} }
                    onClick={() => handleRemoveField('steps', index)}
                    disabled={recipeData.steps.length === 1}
                  >
                    <RemoveIcon />
                  </CustomIconButton>
                </Box>
              </DynamicField>
            ))}

            <Typography variant={'h5'} sx={{paddingTop: 2}}>
              URL of dish image
            </Typography>
            <FormControl fullWidth>
              <StyledTextField
                label="Image URL"
                name="img"
                value={recipeData.img}
                onChange={(e) => handleInputChange(e, 'img')}
                fullWidth
                margin="normal"
                sx={{marginBottom: 4}}
              />
            </FormControl>

            <CustomButton type="submit" variant="contained" fullWidth sx={{fontWeight: 700}}>
              Add Recipe
            </CustomButton>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddRecipeB;
