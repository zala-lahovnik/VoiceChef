import express from 'express';
import mongoose from 'mongoose';
import connectDB from './db.js';
import recipeRoute from './routes/recipesRoute.js';
import authRoute from './routes/authRoute.js';
import itemRoute from './routes/itemsRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth } from 'express-openid-connect';
import checkJwt from './middleware/auth.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
/*
// Serve static files from the React app
app.use(express.static(path.join('C:/Users/Domen/OneDrive/1. letnik mag/ST/VoiceChef/src/', 'odjemalec/build'), {
  maxAge: '1d',
  etag: false
}));

// Serve the service worker with correct Content-Type
app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.resolve('C:/Users/Domen/OneDrive/1. letnik mag/ST/VoiceChef/src/', 'odjemalec/build/service-worker.js'), {
    headers: {
      'Content-Type': 'application/javascript'
    }
  });
});
*/
// Javne poti
app.use('/auth', authRoute);
console.log('Auth route registered'); // Diagnostic log

app.get('/', (req, res) => {
  res.send('Welcome to Voice Chef!');
});

// Zaščitene poti
app.use('/recipes', recipeRoute);
// app.use('/recipes', checkJwt, recipeRoute);
app.use('/items', itemRoute);
/*
// Catch all other routes and return the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.resolve('C:/Users/Domen/OneDrive/1. letnik mag/ST/VoiceChef/src/', 'odjemalec/build', 'index.html'));
});
*/
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
