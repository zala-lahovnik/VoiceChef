import express from 'express'
import mongoose from 'mongoose';
import connectDB from './db.js';
import Recipe from './models/recipe.js';

const app = express();
const PORT = 5000;
connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to Voice Chef!');
});

app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching recipes.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
