import express from 'express';
import Recipe from "../models/recipe.js";

const router = express.Router();

// Route to create a new recipe
router.post('/', async (req, res) => {
    try {
        const { userId, title, category, times, numberOfPeople, ingredients, steps, img } = req.body;

        // Ensure userId is included
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Create a new recipe with userId included
        const recipe = new Recipe({
            userId,
            title,
            category,
            times,
            numberOfPeople,
            ingredients,
            steps,
            img
        });

        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(400).json({ error: 'An error occurred while creating the recipe.' });
    }
});

// Route to get all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching recipes.' });
    }
});

// Route to get a recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found.' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the recipe.' });
    }
});

// Route to update a recipe by ID
router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found.' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(400).json({ error: 'An error occurred while updating the recipe.' });
    }
});

// Route to delete a recipe by ID
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found.' });
        }
        res.status(200).json({ message: 'Recipe deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the recipe.' });
    }
});

// Route to get recipes submitted by a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userRecipes = await Recipe.find({ userId });
        res.status(200).json(userRecipes);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the recipes.' });
    }
});

export default router;