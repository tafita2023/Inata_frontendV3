import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
const myBaseUrl = isDevelopment 
  ? import.meta.env.VITE_API_BASE_URL_LOCAL
  : import.meta.env.VITE_API_BASE_URL_DEPLOY;

const AxiosInstance = axios.create({ 
  baseURL: myBaseUrl, 
  timeout: 50000, // 50 secondes
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;
