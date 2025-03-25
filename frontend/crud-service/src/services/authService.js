import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

// Create an axios instance with the base URL
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Function to handle user login
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, {
            username: userData.username,
            password: userData.password
        });
        return response.data; // Return the response data (tokens)
    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error('Неверный логин или пароль');
        }
        const errorMessage = error.response ? error.response.data.detail : error.message;
        throw new Error('Ошибка при входе: ' + errorMessage);
    }
};

// Function to refresh the access token using the refresh token
export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/users/refresh`, {
            refresh_token: refreshToken,
        });
        return response.data; // Return the response data (new access token)
    } catch (error) {
        throw new Error('Ошибка при обновлении токенов: ' + error.response.data.detail);
    }
};

// Set up a response interceptor for handling 401 Unauthorized errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // If the error is 401 and the request has not been retried yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as retried
            try {
                // Try to refresh the access token using the refresh token
                const refresh_token = localStorage.getItem("refresh_token");
                if (!refresh_token) throw new Error("No refresh token");

                const { new_access_token } = await refreshAccessToken(refresh_token);
                // Save the new access token in local storage
                localStorage.setItem("access_token", new_access_token);
                // Set the Authorization header with the new access token and retry the original request
                originalRequest.headers["Authorization"] = `Bearer ${new_access_token}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error("Ошибка обновления токена", err);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate('/login');
            }
        }
        return Promise.reject(error);
    }
);

// Set up a request interceptor to include the access token in request headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
