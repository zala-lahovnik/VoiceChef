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
import voiceChefApi from '../utils/axios'; // Import the existing Axios instance
import './AddRecipe.css';

interface Time {
  label: string;
  time: string;
}

interface Ingredient {
  quantity: number;
  unit: string;
  description: string;
}

interface Step {
  step: number;
  text: string;
}

interface RecipeData {
  title: string;
  category: string;
  times: Time[];
  numberOfPeople: string;
  ingredients: Ingredient[];
  steps: Step[];
  img: string;
}

const Container = styled(Grid)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#2D303E',
  color: 'white',
});

const Form = styled(Grid)({
  backgroundColor: '#393C49',
  padding: '20px',
  borderRadius: '16px',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)',
});

const Title = styled(Typography)({
  textAlign: 'center',
  marginBottom: '20px',
  color: '#c17c37',
});

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
});

const CustomButton = styled(Button)({
  backgroundColor: '#c17c37',
  color: 'white',
  '&:hover': {
    backgroundColor: '#b56929',
  },
});

const CustomIconButton = styled(IconButton)({
  color: '#c17c37',
});

const DynamicField = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px',
});

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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof RecipeData,
    index?: number,
    subField?: string
  ) => {
    if (!recipeData) return;
    const { value } = e.target;
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
      navigate('/'); // Navigate to the home page after saving offline
    }
  };

  const saveRecipeOffline = (recipeData: RecipeData) => {
    let offlineRecipes = JSON.parse(localStorage.getItem('offlineRecipes') || '[]');
    offlineRecipes.push(recipeData);
    localStorage.setItem('offlineRecipes', JSON.stringify(offlineRecipes));
    alert('Recipe update saved locally. It will be synced when you go back online.');
  };

  if (!recipeData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container container>
      <Form item xs={12} md={8}>
        <Title variant="h4">Edit Recipe</Title>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <CustomTextField
              label="Title"
              name="title"
              value={recipeData.title}
              onChange={(e) => handleInputChange(e, 'title')}
              fullWidth
              margin="normal"
            />
          </FormControl>
          <FormControl fullWidth>
            <CustomTextField
              label="Category"
              name="category"
              value={recipeData.category}
              onChange={(e) => handleInputChange(e, 'category')}
              fullWidth
              margin="normal"
            />
          </FormControl>
          <FormControl fullWidth>
            <CustomTextField
              label="Number of People"
              name="numberOfPeople"
              value={recipeData.numberOfPeople}
              onChange={(e) => handleInputChange(e, 'numberOfPeople')}
              fullWidth
              margin="normal"
            />
          </FormControl>

          {/* Dynamic Fields for Times */}
          {recipeData.times.map((time, index) => (
            <DynamicField key={index}>
              <CustomTextField
                label={`Time ${index + 1} Label`}
                name="label"
                value={time.label}
                onChange={(e) => handleInputChange(e, 'times', index, 'label')}
                fullWidth
                margin="normal"
              />
              <CustomTextField
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

          {/* Dynamic Fields for Ingredients */}
          {recipeData.ingredients.map((ingredient, index) => (
            <DynamicField key={index}>
              <CustomTextField
                label={`Ingredient ${index + 1} Quantity`}
                name="quantity"
                type="number"
                value={ingredient.quantity}
                onChange={(e) => handleInputChange(e, 'ingredients', index, 'quantity')}
                fullWidth
                margin="normal"
              />
              <CustomTextField
                label={`Ingredient ${index + 1} Unit`}
                name="unit"
                value={ingredient.unit}
                onChange={(e) => handleInputChange(e, 'ingredients', index, 'unit')}
                fullWidth
                margin="normal"
              />
              <CustomTextField
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

          {/* Dynamic Fields for Steps */}
          {recipeData.steps.map((step, index) => (
            <DynamicField key={index}>
              <CustomTextField
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

          <FormControl fullWidth>
            <CustomTextField
              label="Image URL"
              name="img"
              value={recipeData.img}
              onChange={(e) => handleInputChange(e, 'img')}
              fullWidth
              margin="normal"
            />
          </FormControl>

          <CustomButton type="submit" variant="contained" fullWidth>
            Save Recipe
          </CustomButton>
        </form>
      </Form>
    </Container>
  );
};

export default EditRecipePage;