import Axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosHeaders,
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

const saveRequestToLocalStorage = (config: InternalAxiosRequestConfig) => {
  const requests = JSON.parse(localStorage.getItem("offlineRequests") || "[]");
  requests.push(config);
  localStorage.setItem("offlineRequests", JSON.stringify(requests));
};

// Dodamo interceptor za dodajanje dostopnega žetona v glavo vsake zahteve
voiceChefApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      if (config.headers) {
        const headers = config.headers as AxiosHeaders;
        headers.set("Authorization", `Bearer ${token}`);
        console.log("Authorization header set:", headers.get("Authorization"));
      }
    }

    if (!isOnline()) {
      console.log(`Saving request to localStorage: ${config.url}`);
      saveRequestToLocalStorage(config);
      return Promise.reject({ message: "offline" });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dodamo interceptor za shranjevanje odgovorov API zahtev v localStorage
voiceChefApi.interceptors.response.use(
  (response) => {
    if (isOnline()) {
      const url = response.config.url;
      const method = response.config.method;
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
