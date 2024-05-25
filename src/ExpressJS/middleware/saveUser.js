import axios from 'axios';
import User from '../models/user.js';

const saveUser = async (req, res, next) => {
  console.log('saveUser middleware called'); // Diagnostic log

  if (req.auth && req.auth.sub) {  // Preverimo, če je JWT token pravilno verificiran
    console.log('User info found in request:', req.auth); // Diagnostic log

    try {
      // Pridobivanje dodatnih uporabniških podatkov iz Auth0
      const userInfo = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`,
        },
      });

      const { email, name } = userInfo.data;

      let user = await User.findOne({ email });
      if (!user) {
        console.log('User not found in database, creating a new one.'); // Diagnostic log
        user = new User({ email, name });
        await user.save();
        console.log('User saved to database.'); // Diagnostic log
      } else {
        console.log('User already exists in database.'); // Diagnostic log
      }
    } catch (err) {
      console.error(`Error finding or saving user: ${err.message}`); // Diagnostic log
    }
  } else {
    console.log('No user info found in request.'); // Diagnostic log
  }
  next();
};

export default saveUser;
