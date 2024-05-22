import express from 'express';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';

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

router.get('/profile', (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

export default router;