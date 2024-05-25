import express from 'express';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
import saveUser from '../middleware/saveUser.js';  // Import middleware
import checkJwt from '../middleware/auth.js';  // Import auth middleware

dotenv.config();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

const router = express.Router();

router.use(auth(config));
console.log('Auth route loaded'); // Diagnostic log

router.post('/register', checkJwt, saveUser, (req, res) => {
  console.log('/register route accessed'); // Diagnostic log
  res.status(201).send({ message: 'User registered successfully' });
});

router.get('/profile', (req, res) => {
  console.log('/profile route accessed'); // Diagnostic log
  res.send(JSON.stringify(req.oidc.user));
});

export default router;
