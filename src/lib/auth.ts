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
  },

  // Google OAuth
  getGoogleUrl: async () => {
    const { data } = await apiClient.get<{ url: string }>(endpoints.googleUrl);
    return data;
  },

  googleCallback: async (code: string) => {
    const { data } = await apiClient.post(endpoints.googleCallback, { code });
    return data;
  },

  // Password reset
  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post(endpoints.forgotPassword, { email });
    return data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const { data } = await apiClient.post(endpoints.resetPassword, {
      token,
      new_password: newPassword,
      new_password_confirm: newPassword,
    });
    return data;
  },

  // Password change
  changePassword: async (credentials: { old_password: string; new_password: string; new_password_confirm: string }) => {
    const { data } = await apiClient.post(endpoints.changePassword, credentials);
    return data;
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        await apiClient.post(endpoints.logout, { refresh: refreshToken });
      } catch (err) {
        console.error("Failed to blacklist token on logout:", err);
      }
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/auth/signin";
  }
};

