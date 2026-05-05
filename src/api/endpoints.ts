

export const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;      
export const API_BASE_URL = SERVER_BASE_URL;

export const ENDPOINTS = {
  UPLOAD: '/api/images/upload',
  PROCESS: '/api/images/process',
  REMOVE_BG: '/api/images/remove-bg',
  PRINT_LAYOUT: '/api/print/generate',
  FEEDBACK: '/feedback',
  ANALYTICS: '/feedback/average',
};

// Log API configuration in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', {
    SERVER_BASE_URL,
    API_BASE_URL,
    ENV_VAR: process.env.NEXT_PUBLIC_SERVER_URL || 'Not set (using default)',
  });
}
