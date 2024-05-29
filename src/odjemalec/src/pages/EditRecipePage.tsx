import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/system';
import voiceChefApi from '../utils/axios';
import './AddRecipe.css';
import {StyledTextField} from "./HomePage";
import {CustomButton, CustomIconButton, DynamicField, RecipeData, Title} from "./AddRecipe";
import SideMenu from "../components/SideMenu/SideMenu";

const EditRecipePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const result = await voiceChefApi.get(`/recipes/${id}`);
        setRecipeData(result.data);
      } catch (error) {
        console.error('Error fetching recipe', error);
      }
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const syncOfflineRecipes = async () => {
      const offlineRecipes = JSON.parse(localStorage.getItem('offlineRecipes') || '[]');
      if (offlineRecipes.length > 0) {
        for (const recipe of offlineRecipes) {
          try {
            await voiceChefApi.post('/recipes', recipe);
          } catch (error) {
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
    if (!recipeData) return;
    const { name, value } = e.target;
    setRecipeData((prevData) => {
      if (!prevData) return prevData;
      if (index !== undefined && subField) {
        const updatedField = [...(prevData[field] as any)];
        if (subField in updatedField[index]) {
          updatedField[index][subField] = value;
          return { ...prevData, [field]: updatedField };
        }
      } else {
        return { ...prevData, [field]: value };
      }
      return prevData;
    });
  };

  const handleAddField = (field: keyof RecipeData) => {
    if (!recipeData) return;
    setRecipeData((prevData) => {
      if (!prevData) return prevData;
      const updatedField = [...(prevData[field] as any)];
      if (field === 'times') updatedField.push({ label: '', time: '' });
      if (field === 'ingredients') updatedField.push({ quantity: 0, unit: '', description: '' });
      if (field === 'steps') updatedField.push({ step: updatedField.length + 1, text: '' });
      return { ...prevData, [field]: updatedField };
    });
  };

  const handleRemoveField = (field: keyof RecipeData, index: number) => {
    if (!recipeData) return;
    setRecipeData((prevData) => {
      if (!prevData) return prevData;
      const updatedField = [...(prevData[field] as any)];
      updatedField.splice(index, 1);
      return { ...prevData, [field]: updatedField };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!recipeData) return;
    try {
      await voiceChefApi.put(`/recipes/${id}`, recipeData);
      navigate('/'); // Navigate to the home page after successful update
    } catch (error) {
      console.error('Error updating recipe', error);
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

  if (!recipeData) {
    return <Typography>Loading...</Typography>;
  }

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

      <Grid item xs={11} sx={{display: 'flex', padding: 10, overflowY: 'scroll', height: '100%',
        maxHeight: '100%'}}>
        <Grid item xs={12} sx={{
          // backgroundColor: '#252836',
          backgroundColor: '#1F1D2B',
          display: 'flex',
          flexDirection: 'column',
          padding: 12, // 8
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: '16px',
          height: 'fit-content'
        }}>
          <Title variant="h4">Edit Recipe</Title>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
            <FormControl fullWidth sx={{display: 'flex', flexDirection: 'row', columnGap: 4}}>
              <StyledTextField
                label="Title"
                name="title"
                value={recipeData.title}
                onChange={(e) => handleInputChange(e, 'title')}
                margin="normal"
                sx={{width: '60%'}}
              />
              <StyledTextField
                label="Category"
                name="category"
                value={recipeData.category}
                onChange={(e) => handleInputChange(e, 'category')}
                sx={{width: '30%'}}
                margin="normal"
              />
              <StyledTextField
                label="Number of People"
                name="numberOfPeople"
                type='number'
                value={recipeData.numberOfPeople}
                onChange={(e) => handleInputChange(e, 'numberOfPeople')}
                sx={{width: '10%'}}
                margin="normal"
              />
            </FormControl>

            <Typography variant={'h5'} sx={{paddingTop: 2}}>
              Food preparation times
            </Typography>
            {/* Dynamic Fields for Times */}
            {recipeData.times.map((time, index) => (
              <DynamicField key={index}>
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
                <CustomIconButton onClick={() => handleAddField('times')}><AddIcon /></CustomIconButton>
                <CustomIconButton onClick={() => handleRemoveField('times', index)} disabled={recipeData.times.length === 1}><RemoveIcon /></CustomIconButton>
              </DynamicField>
            ))}

            <Typography variant={'h5'} sx={{paddingTop: 2}}>
              Ingredients needed
            </Typography>
            {/* Dynamic Fields for Ingredients */}
            {recipeData.ingredients.map((ingredient, index) => (
              <DynamicField key={index}>
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
                <CustomIconButton onClick={() => handleAddField('ingredients')}><AddIcon /></CustomIconButton>
                <CustomIconButton onClick={() => handleRemoveField('ingredients', index)} disabled={recipeData.ingredients.length === 1}><RemoveIcon /></CustomIconButton>
              </DynamicField>
            ))}

            <Typography variant={'h5'} sx={{paddingTop: 2}}>
              Recipe steps
            </Typography>
            {/* Dynamic Fields for Steps */}
            {recipeData.steps.map((step, index) => (
              <DynamicField key={index}>
                <StyledTextField
                  label={`Step ${index + 1}`}
                  name="text"
                  value={step.text}
                  onChange={(e) => handleInputChange(e, 'steps', index, 'text')}
                  fullWidth
                  margin="normal"
                />
                <CustomIconButton onClick={() => handleAddField('steps')}><AddIcon /></CustomIconButton>
                <CustomIconButton onClick={() => handleRemoveField('steps', index)} disabled={recipeData.steps.length === 1}><RemoveIcon /></CustomIconButton>
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
              Save Recipe
            </CustomButton>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EditRecipePage;