import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/vacancy';

export const fetchVacancies = async () => {
  try {
    const response = await axios.get(`${API_URL}/list`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении вакансий:', error);
    throw error;
  }
};
