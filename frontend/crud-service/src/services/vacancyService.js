import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/vacancy';

export const fetchVacancies = async (page = 1, pageSize = 5) => {
    try {
        const response = await axios.get(`${API_URL}/list`, {
            params: {
                page,
                page_size: pageSize,
            },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении вакансий:', error);
        throw error;
    }
};

export const addVacancy = async (vacancyId) => {
    try {
        const response = await axios.post(`${API_URL}/create/${vacancyId}`,  {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
        return response.data;
    } catch (error) {
        console.error('Ошибка при добавлении вакансии:', error);
        throw error;
    }
};

export const deleteVacancy = async (vacancyId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${vacancyId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
        return response.data;
    } catch (error) {
        console.error('Ошибка при удалении вакансии:', error);
        throw error;
    }
};

export const updateVacancy = async (vacancyId) => {
    try {
        const response = await axios.put(`${API_URL}/update/${vacancyId}`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении данных о вакансии:', error);
        throw error;
    }
};

export const editVacancy = async (editedVacancy) => {
    try {
         const response = await axios.patch(`${API_URL}/update/`, editedVacancy, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении данных о вакансии:', error);
        throw error;
    }
};