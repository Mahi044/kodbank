import axios from 'axios';

const api = axios.create({
    withCredentials: true, // Important for cookies
});

// Add a response interceptor to handle errors globally if needed
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
