import axios from 'axios';

const API_URL = 'http://localhost:8001/api/users';

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
        username: userData.username ? username : null,
        password: userData.password ? password : null
    });
    console.log('Response!');
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.detail : error.message;
    throw new Error('Ошибка при входе: ' + errorMessage);
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}/refresh`, {
      refresh_token: refreshToken,
    });
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при обновлении токенов: ' + error.response.data.detail);
  }
};