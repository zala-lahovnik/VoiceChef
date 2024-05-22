import express from 'express'
import Recipe from "../models/recipe.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        res.status(400).json({ error: 'An error occurred while creating the recipe.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching recipes.' });
    }
});

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

export default router