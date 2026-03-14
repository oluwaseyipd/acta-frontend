
import apiClient, { endpoints } from '@/lib/api-client';

export const categoryApi = {
 getCategories: async () => {
    const { data } = await apiClient.get(endpoints.categories);
    // Extract the results array from the Django pagination object
    return data.results || data; 
  },

  getCategory: async (id: string) => {
    const { data } = await apiClient.get(`${endpoints.categories}${id}/`);
    return data;
  },
  createCategory: async (categoryData: any) => {
    const { data } = await apiClient.post(endpoints.categories, categoryData);
    return data;
  },
};
