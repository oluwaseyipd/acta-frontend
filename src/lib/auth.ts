// In api/auth.ts (or similar)
import apiClient, { endpoints } from '@/lib/api-client';

/**
 * Checks if a JWT token is expired by decoding its payload.
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    if (!decoded.exp) return false;
    // Add 5 second buffer to guard against minor clock differences
    return Date.now() >= (decoded.exp * 1000) - 5000;
  } catch {
    return true;
  }
}

/**
 * Returns true if the user has a valid access token or a valid refresh token.
 */
export function isAuthenticated(): boolean {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // If access token is present and valid
  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }

  // If access token is expired or missing, but refresh token is still valid
  if (refreshToken && !isTokenExpired(refreshToken)) {
    return true;
  }

  return false;
}

/**
 * Clears authentication tokens from local storage.
 */
export function clearAuthSession(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

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
    clearAuthSession();
    window.location.href = "/auth/signin";
  }
};


