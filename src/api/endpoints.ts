/**
 * API Configuration
 * 
 * Set NEXT_PUBLIC_SERVER_URL environment variable to override the default backend URL
 * 
 * Examples:
 * - Development: http://localhost:5000
 * - Production: https://api.example.com
 * 
 * In .env.local:
 * NEXT_PUBLIC_SERVER_URL=http://localhost:5000
 */

export const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
export const API_BASE_URL = `${SERVER_BASE_URL}/api`;

export const ENDPOINTS = {
  UPLOAD: '/upload',
  PROCESS: '/process',
  PRINT_LAYOUT: '/print-layout',
  FEEDBACK: '/feedback',
  ANALYTICS: '/analytics',
};

// Log API configuration in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', {
    SERVER_BASE_URL,
    API_BASE_URL,
    ENV_VAR: process.env.NEXT_PUBLIC_SERVER_URL || 'Not set (using default)',
  });
}
