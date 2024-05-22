import Axios from 'axios';

// Ustvarimo Axios instanco
export const voiceChefApi = Axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Dodamo interceptor za dodajanje dostopnega žetona v glavo vsake zahteve
voiceChefApi.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default voiceChefApi;