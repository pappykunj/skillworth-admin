
import apiClient from './index';

export const loginAdmin = async (credentials) => {
  try {
    const response = await apiClient.post('/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await apiClient.post('/admin/add-user', userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
