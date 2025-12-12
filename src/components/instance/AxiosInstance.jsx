import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
const myBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL: import.meta.env.VITE_API_BASE_URL_DEPLOY

const AxiosInstance = axios.create({ 
    baseURL: myBaseUrl, 
    timeout: 50000, // 50 secondes de temps d'attente maximum
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default AxiosInstance