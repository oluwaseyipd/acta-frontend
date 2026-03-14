import apiClient, { endpoints } from '@/lib/api-client';

export const profileApi = {
  getProfile: async () => {
    const { data } = await apiClient.get(endpoints.profile);
    return data;
  },

  updateProfile: async (profileData: FormData) => {
    const { data } = await apiClient.patch(endpoints.profile, profileData, {
      headers: {
        // This allows the browser to set the Content-Type with the correct boundary
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
}; 