import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { clearStoredUser, getRefreshToken, setTokens, storeUser } from '@/lib/auth';

interface AuthPayload {
  email: string;
  password: string;
}

interface SignupPayload extends AuthPayload {
  name: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
  accessToken: string;
  refreshToken: string;
}

export function useAuth() {
  const login = useMutation({
    mutationFn: async (payload: AuthPayload) => {
      const response = await apiClient.post<AuthResponse>(ENDPOINTS.LOGIN, payload);
      return response.data;
    },
    onSuccess: (data) => {
      storeUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
    },
  });

  const signup = useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const response = await apiClient.post<AuthResponse>(ENDPOINTS.SIGNUP, payload);
      return response.data;
    },
    onSuccess: (data) => {
      storeUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiClient.post(ENDPOINTS.LOGOUT, { refreshToken });
      }
      return true;
    },
    onSettled: () => {
      clearStoredUser();
      window.location.href = '/login';
    },
  });

  return { login, signup, logout };
}

