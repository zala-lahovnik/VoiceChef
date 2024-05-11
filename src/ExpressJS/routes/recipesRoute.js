import express from 'express'
import Recipe from "../models/recipe.js";


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching recipes.' });
    }
});


export default router