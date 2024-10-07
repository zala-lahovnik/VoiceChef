<img src="doc/voicechef-logo/png/logo-no-background.png" />

# Voice Chef 🍽️🗣️
Voice Chef is an innovative application designed to enhance your cooking experience by providing a hands-free, voice-activated interface for following recipes. 📱👐 With Voice Chef, you can easily navigate through step-by-step cooking instructions 📜➡️🍳 using simple voice commands 🎙️🗣️, ensuring a seamless and efficient culinary process. Whether you're a novice cook 👩‍🍳 or an experienced chef 👨‍🍳, Voice Chef helps you focus on the joy of cooking 🍲❤️ without the hassle of constantly referring to your phone or recipe book 📖📵.

👨‍🍳👩‍🍳 Cook with ease and enjoy your culinary journey with Voice Chef! 🎉🍲

---

# Backend Installation Guide 🚀
To set up the backend for Voice Chef, follow these steps:

## Prerequisites
Make sure you have the following installed on your machine:

- Node.js (v14 or higher recommended)
- npm (v6 or higher)


Navigate to the `src/ExpressJS` directory and install the required npm packages:

```sh
npm install
```

This will install the following dependencies:
- `axios` (^1.7.2)
- `cors` (^2.8.5)
- `dotenv` (^16.4.5)
- `express` (^4.19.2)
- `express-jwt` (^8.4.1)
- `express-openid-connect` (^2.17.1)
- `jwks-rsa` (^3.1.0)
- `mongoose` (^8.3.3)
- `web-push` (^3.6.7)

## Configuration

Create a .env file in the src/ExpressJS directory and add your environment variables as required. Your .env file should look like this:

```env
AUTH0_DOMAIN=<AUTH0_DOMAIN_VALUE>
AUTH0_AUDIENCE=<AUTH0_AUDIENCE_VALUE>
SECRET=<SECRET_VALUE>
PORT=<PORT_VALUE>
BASE_URL=<BASE_URL_VALUE>
CLIENT_ID=<CLIENT_ID_VALUE>
ISSUER_BASE_URL=<ISSUER_BASE_URL_VALUE>
MONGODB_URI=<MONGODB_URI_VALUE>

MAILTO_ADDRESS=<MAILTO_ADDRESS_VALUE>
VAPID_PUBLIC_KEY=<VAPID_PUBLIC_KEY_VALUE>
VAPID_PRIVATE_KEY=<VAPID_PRIVATE_KEY_VALUE>
```

`AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `SECRET`, `CLIENT_ID`, `ISSUER_BASE_URL` can all be obtained by creating a project
[here](). `PORT` is the port where you want the backend to run. `BASE_URL` is where your backend will be available. While 
developing locally this will be `http://localhost:5000`. `MONGODB_URI` is the connection string to your MongoDB database.
`MAILTO_ADDRESS` is an email address to provide push notifications, in the following form: `mailto:<EMAIL_ADDRESS>`.
`VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` are keys that can be generated using [Node](https://gabrieleromanato.name/how-to-generate-vapid-keys-with-nodejs).

## Start the Server
Once the dependencies are installed and your environment variables are configured, start the server:

```sh
npm start
```

Your ExpressJS server should now be running on the port specified in your .env file (default is 5000).

By following these steps, you'll have the backend for Voice Chef up and running in no time! 🧑‍🍳🚀

---

## Frontend Installation Guide 🌐

To set up the frontend for Voice Chef, follow these steps:

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v16 or higher recommended)
- npm (v6 or higher)

### Step-by-Step Installation

1. **Install Dependencies**

   Navigate to the `src/odjemalec` directory and install the required npm packages:

   ```sh
   npm install
   ```

   This will install the following dependencies:

   - `@auth0/auth0-react` (^2.2.4)
   - `@emotion/react` (^11.11.4)
   - `@emotion/styled` (^11.11.5)
   - `@mui/icons-material` (^5.15.18)
   - `@mui/material` (^5.15.17)
   - `@testing-library/jest-dom` (^5.17.0)
   - `@testing-library/react` (^13.4.0)
   - `@testing-library/user-event` (^13.5.0)
   - `@types/jest` (^27.5.2)
   - `@types/node` (^17.0.45)
   - `@types/react` (^18.3.2)
   - `@types/react-dom` (^18.3.0)
   - `axios` (^1.7.1)
   - `react` (^18.3.1)
   - `react-dom` (^18.3.1)
   - `react-router-dom` (^6.23.1)
   - `react-scripts` (5.0.1)
   - `typescript` (^4.9.5)
   - `web-vitals` (^2.1.4)
   - `workbox-background-sync` (^6.6.0)
   - `workbox-broadcast-update` (^6.6.0)
   - `workbox-cacheable-response` (^6.6.0)
   - `workbox-core` (^6.6.0)
   - `workbox-expiration` (^6.6.0)
   - `workbox-google-analytics` (^6.6.1)
   - `workbox-navigation-preload` (^6.6.0)
   - `workbox-precaching` (^6.6.0)
   - `workbox-range-requests` (^6.6.0)
   - `workbox-routing` (^6.6.0)
   - `workbox-strategies` (^6.6.0)
   - `workbox-streams` (^6.6.0)

   Additionally, the following devDependencies will be installed:
   
   - `react-app-rewired` (^2.2.1)
   - `workbox-webpack-plugin` (^7.1.0)

2. **Configuration**

   Ensure you have a `.env` file in the `src/odjemalec` directory if any environment variables are needed. Your `.env` file should look like this:

```env
REACT_APP_BACKEND_API_URL=<REACT_APP_BACKEND_API_URL_VALUE>
REACT_APP_AUTH0_DOMAIN=<REACT_APP_AUTH0_DOMAIN_VALUE>
REACT_APP_AUTH0_CLIENT_ID=<REACT_APP_AUTH0_CLIENT_ID_VALUE>
REACT_APP_AUTH0_AUDIENCE=<REACT_APP_AUTH0_AUDIENCE_VALUE>
PUBLIC_URL=<PUBLIC_URL_VALUE>

BASE_URL=<BASE_URL_VALUE>
```

`REACT_APP_AUTH0_DOMAIN`, `REACT_APP_AUTH0_CLIENT_ID`, `REACT_APP_AUTH0_AUDIENCE` are the same as the backend values.
`PUBLIC_URL` and `BASE_URL` are the URL where your frontend will live. While developing, this will be `http://localhost:3000`.
`REACT_APP_BACKEND_API_URL` is the URL where your backend is available. While developing, this will be `http://localhost:5000`, 
unless the port value was changed.


3. **Start the Development Server**

   Once the dependencies are installed and your environment variables are configured, start the development server:

```sh
npm start
```

   Your React application should now be running on `http://localhost:3000`.

### Additional Scripts

- **Start**: `npm start` - Runs the application in development mode.
- **Build**: `npm run build` - Builds the application for production.
- **Test**: `npm test` - Runs the test suite.
- **Eject**: `npm run eject` - Ejects the configuration (use with caution).

By following these steps, you'll have the frontend for Voice Chef up and running smoothly! 🌟✨

---
