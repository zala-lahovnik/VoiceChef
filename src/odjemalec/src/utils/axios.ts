import Axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Ustvarimo Axios instanco
export const voiceChefApi = Axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Funkcija za preverjanje, ali je aplikacija online
const isOnline = () => {
  return window.navigator.onLine;
};

// Dodamo interceptor za dodajanje dostopnega žetona v glavo vsake zahteve
voiceChefApi.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
      console.log(
        "Authorization header set:",
        config.headers.get("Authorization")
      );
    }

    if (!isOnline()) {
      const url = config.url;
      const method = config.method?.toUpperCase();
      const key = `${method}:${url}`;
      const cachedData = localStorage.getItem(key);

      if (cachedData) {
        console.log(`Using cached data for ${key}`);
        return {
          ...config,
          data: JSON.parse(cachedData),
          headers: config.headers,
          status: 200,
          statusText: "OK",
          request: config,
        } as unknown as InternalAxiosRequestConfig;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dodamo interceptor za shranjevanje odgovorov API zahtev v localStorage
voiceChefApi.interceptors.response.use(
  (response: AxiosResponse) => {
    if (isOnline()) {
      const url = response.config.url;
      const method = response.config.method?.toUpperCase();
      const key = `${method}:${url}`;

      localStorage.setItem(key, JSON.stringify(response.data));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default voiceChefApi;
