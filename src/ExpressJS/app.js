import express from 'express';
import mongoose from 'mongoose';
import connectDB from './db.js';
import Recipe from './models/recipe.js';
import recipeRoute from './routes/recipesRoute.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/auth', authRoute);

// Protected routes
app.use('/recipes', auth, recipeRoute);

app.get('/', (req, res) => {
    res.send('Welcome to Voice Chef!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
