
import apiClient from './index';

export const loginAdmin = async (credentials) => {
  try {
    const response = await apiClient.post('/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};
