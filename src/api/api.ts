import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from './endpoints';
import { clearStoredUser, getAccessToken, getRefreshToken, setTokens } from '@/lib/auth';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const resolvePending = (token: string | null) => {
  pendingRequests.forEach((callback) => callback(token));
  pendingRequests = [];
};

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Request interceptor to add retry logic
let retryCount = 0;
const MAX_RETRIES = 2;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (error.response?.status === 401 && !config._retry401) {
      config._retry401 = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearStoredUser();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            config.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(config));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}${ENDPOINTS.REFRESH}`, { refreshToken });
        const newAccessToken = refreshResponse.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.refreshToken;

        if (!newAccessToken || !newRefreshToken) {
          throw new Error('Failed to refresh session');
        }

        setTokens(newAccessToken, newRefreshToken);
        resolvePending(newAccessToken);

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(config);
      } catch (refreshError) {
        resolvePending(null);
        clearStoredUser();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Don't retry if it's a client error (4xx)
    if (error.response?.status >= 400 && error.response?.status < 500) {
      // Only log client errors
      return Promise.reject(error);
    }

    // Retry logic for network errors and server errors (5xx)
    if (!config._retry) {
      config._retry = true;
      retryCount = 0;
    }

    if (retryCount < MAX_RETRIES && (!error.response || error.response?.status >= 500)) {
      retryCount++;
      const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(apiClient(config));
        }, delay);
      });
    }

    // Handle network errors - don't log them as they're expected when server is down
    if (!error.response) {
      const errorMsg = error.code === 'ECONNABORTED' 
        ? 'Request timeout. Backend server may be unavailable.'
        : 'Backend server is not responding. Please ensure it is running.';
      error.message = errorMsg;
    }

    return Promise.reject(error);
  }
);

export default apiClient;

