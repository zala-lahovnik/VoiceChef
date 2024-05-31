import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import {StyledTextField} from "./HomePage";
import {CustomButton, CustomIconButton, DynamicField, RecipeData, Title} from "./AddRecipe";
import SideMenu from "../components/SideMenu/SideMenu";
import MenuIcon from "@mui/icons-material/Menu";
import {useResponsive} from "../hooks/responsive";

const EditRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Ensure id is treated as a string
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const responsive = useResponsive('up', 'lg');
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const result = await voiceChefApi.get(`/recipes/${id}`);
        setRecipeData(result.data);
      } catch (error) {
        if (Notification.permission === 'granted') {
          new Notification("Error fetching recipe", {
            body: 'Fetching recipe failed. Please try again later.',
            icon: '/icon-144.png'
          });
        }
        console.error('Error fetching recipe', error);
      }
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const syncOfflineEdits = async () => {
      const offlineEdits = JSON.parse(localStorage.getItem('offlineEdits') || '[]');
      if (offlineEdits.length > 0) {
        for (const edit of offlineEdits) {
          try {
            await voiceChefApi.put(`/recipes/${edit.id}`, edit.data);
          } catch (error) {
            if (Notification.permission === 'granted') {
              new Notification("Error syncing edits", {
                body: 'Syncing edits failed. Please try again later.',
                icon: '/icon-144.png'
              });
            }
            console.error('Error syncing edit', error);
          }
        }
        localStorage.removeItem('offlineEdits');
        alert('Offline edits synced successfully!');
      }
    };

    window.addEventListener('online', syncOfflineEdits);
    return () => {
      window.removeEventListener('online', syncOfflineEdits);
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
      if (Notification.permission === 'granted') {
        new Notification("Error updating recipe", {
          body: 'Updating recipe failed. Please try again later.',
          icon: '/icon-144.png'
        });
      }
      console.error('Error updating recipe', error);
      saveEditOffline(id as string, recipeData); // Type assertion to treat id as string
      navigate('/');
    }
  };

  const saveEditOffline = (id: string, recipeData: RecipeData) => {
    let offlineEdits = JSON.parse(localStorage.getItem('offlineEdits') || '[]');
    offlineEdits.push({ id, data: recipeData });
    localStorage.setItem('offlineEdits', JSON.stringify(offlineEdits));
    alert('Recipe edit saved locally. It will be synced when you go back online.');
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
      height: { xs: '50vh', sm: '95vh', lg: '100vh' }
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

      <Grid item xs={12} lg={11} sx={{display: 'flex', padding: responsive ? 10 : 3, overflowY: responsive ? 'scroll' : 'none', height: '100%',
        maxHeight: '100%', marginBottom: responsive ? 0 : 4}}>
        <Grid item xs={12} sx={{
          // backgroundColor: '#252836',
          backgroundColor: '#1F1D2B',
          display: 'flex',
          flexDirection: 'column',
          padding: responsive ? 12 : 2,
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: '16px',
          height: 'fit-content'
        }}>
          <Title variant="h4">Edit Recipe</Title>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
            <FormControl fullWidth sx={{display: 'flex', flexDirection: responsive ? 'row' : 'column', columnGap: 4}}>
              <StyledTextField
                label="Title"
                name="title"
                value={recipeData.title}
                onChange={(e) => handleInputChange(e, 'title')}
                margin="normal"
                sx={{width: responsive ? '60%' : '100%'}}
              />
              <StyledTextField
                label="Category"
                name="category"
                value={recipeData.category}
                onChange={(e) => handleInputChange(e, 'category')}
                sx={{width: responsive ? '30%' : '100%'}}
                margin="normal"
              />
              <StyledTextField
                label="Number of People"
                name="numberOfPeople"
                type='number'
                value={recipeData.numberOfPeople}
                onChange={(e) => handleInputChange(e, 'numberOfPeople')}
                sx={{width: responsive ? '10%' : '100%'}}
                margin="normal"
              />
            </FormControl>

            <Typography variant={'h5'} sx={{paddingTop: 2}}>
              Food preparation times
            </Typography>
            {/* Dynamic Fields for Times */}
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
                  <CustomIconButton
                    sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} }
                    onClick={() => handleAddField('times')}><AddIcon /></CustomIconButton>
                  <CustomIconButton
                    sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} }
                    onClick={() => handleRemoveField('times', index)} disabled={recipeData.times.length === 1}><RemoveIcon /></CustomIconButton>
                </Box>
              </DynamicField>
            ))}

            <Typography variant={'h5'} sx={{paddingTop: 2}}>
              Ingredients needed
            </Typography>
            {/* Dynamic Fields for Ingredients */}
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
                  <CustomIconButton
                    sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} }
                    onClick={() => handleAddField('ingredients')}>
                    <AddIcon />
                  </CustomIconButton>
                  <CustomIconButton
                    sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} }
                    onClick={() => handleRemoveField('ingredients', index)} disabled={recipeData.ingredients.length === 1}>
                    <RemoveIcon />
                  </CustomIconButton>
                </Box>
              </DynamicField>
            ))}

            <Typography variant={'h5'} sx={{paddingTop: 2}}>
              Recipe steps
            </Typography>
            {/* Dynamic Fields for Steps */}
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
                  <CustomIconButton
                    sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} }
                    onClick={() => handleAddField('steps')}
                  >
                    <AddIcon />
                  </CustomIconButton>
                  <CustomIconButton
                    sx={ responsive ? {} : {width: '45%', borderRadius: '16px'} }
                    onClick={() => handleRemoveField('steps', index)} disabled={recipeData.steps.length === 1}
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
              Save Recipe
            </CustomButton>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EditRecipePage;