import axiosInstance from '../services/authService';

const API_URL = '/v1/vacancy';

// Fetch a list of vacancies with pagination
export const fetchVacancies = async (page = 1, pageSize = 5) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/list`, {
            params: { page, page_size: pageSize },
        })
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении вакансий:', error);
        throw error;
    }
};

// Add a new vacancy by ID
export const addVacancy = async (vacancyId) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/create/${vacancyId}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при добавлении вакансии:', error);
        throw error;
    }
};

// Delete a vacancy by ID
export const deleteVacancy = async (vacancyId) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/delete/${vacancyId}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при удалении вакансии:', error);
        throw error;
    }
};

// Update a vacancy by ID
export const updateVacancy = async (vacancyId) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/update/${vacancyId}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении данных о вакансии:', error);
        throw error;
    }
};

// Edit a vacancy with new data
export const editVacancy = async (editedVacancy) => {
    try {
        const response = await axiosInstance.patch(`${API_URL}/update/`, editedVacancy)
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении данных о вакансии:', error);
        throw error;
    }
};