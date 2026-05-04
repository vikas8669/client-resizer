import axios from 'axios';
import { API_BASE_URL } from './endpoints';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add retry logic
let retryCount = 0;
const MAX_RETRIES = 2;

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;
    
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


