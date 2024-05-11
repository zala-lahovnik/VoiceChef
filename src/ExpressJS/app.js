import express from 'express'
import mongoose from 'mongoose';
import connectDB from './db.js';
import Recipe from './models/recipe.js';
import recipeRoute from './routes/recipesRoute.js'
import cors from 'cors'

const app = express();
const PORT = 5000;
connectDB();

app.use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to Voice Chef!');
});

app.use('/recipes', recipeRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
