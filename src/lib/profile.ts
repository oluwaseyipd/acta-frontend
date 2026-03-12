import apiClient, { endpoints } from '@/lib/api-client';

export const profileApi = {
  getProfile: async () => {
    const { data } = await apiClient.get(endpoints.profile);
    return data;
  }
};