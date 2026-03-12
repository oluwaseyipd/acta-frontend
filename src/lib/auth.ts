// In api/auth.ts (or similar)
import apiClient, { endpoints } from '@/lib/api-client';

export const authApi = {
    // ... login ...
  login: async (credentials: any) => {
    // This hits your Django '/auth/signin/' endpoint
    const { data } = await apiClient.post(endpoints.signin, credentials);
    return data; // Usually contains { access: "...", refresh: "..." }
  },

    // ... register...
  register: async (userData: any) => {
    const { data } = await apiClient.post(endpoints.register, userData);
    return data;
  }
};
