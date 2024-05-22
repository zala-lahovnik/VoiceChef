import express from 'express';
import mongoose from 'mongoose';
import connectDB from './db.js';
import recipeRoute from './routes/recipesRoute.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth } from 'express-openid-connect';
import checkJwt from './middleware/auth.js'; // Middleware za preverjanje JWT

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

connectDB();

// Nastavitve CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Dovolite zahtevke iz vaše React aplikacije
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Nastavitve Auth0
app.use(auth(config));

// Javne poti
app.use('/auth', authRoute);
app.get('/', (req, res) => {
  res.send('Welcome to Voice Chef!');
});

// Zaščitene poti
app.use('/recipes', checkJwt, recipeRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: 'Something went wrong!',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
