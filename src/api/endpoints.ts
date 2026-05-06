

export const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';      
export const API_BASE_URL = SERVER_BASE_URL;

export const ENDPOINTS = {
  UPLOAD: '/api/images/upload',
  PROCESS: '/api/images/process',
  REMOVE_BG: '/api/images/remove-bg',
  PRINT_LAYOUT: '/api/print/generate',
  LOGIN: '/api/auth/login',
  GOOGLE_LOGIN: '/api/auth/google',
  SIGNUP: '/api/auth/signup',

  REFRESH: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
  CHANGE_PASSWORD: '/api/auth/change-password',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  HISTORY: '/api/auth/history',

  FEEDBACK: '/api/feedback',
  RESOLVED_FEEDBACK: '/api/feedback/resolved',
  RESOLVE_FEEDBACK: (id: string) => `/api/feedback/${id}/resolve`,
  ANALYTICS: '/api/feedback/average',
  USERS: '/api/auth/users',
  DELETE_ME: '/api/auth/me',
  DELETE_USER: (id: string) => `/api/auth/users/${id}`,
};

// Log API configuration in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', {
    SERVER_BASE_URL,
    API_BASE_URL,
    ENV_VAR: process.env.NEXT_PUBLIC_SERVER_URL || 'Not set (using default)',
  });
}
