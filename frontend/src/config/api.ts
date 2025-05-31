// API Configuration for different environments
const getApiBaseUrl = (): string => {
  // In production (Azure Static Web Apps), API calls are automatically routed to /api
  // In development, we can use localhost
  if (import.meta.env.PROD) {
    return ''; // Empty string means relative URLs will be used
  } else {
    return 'http://localhost:8000'; // Development backend
  }
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  if (endpoint.startsWith('/')) {
    return `${API_BASE_URL}${endpoint}`;
  }
  return `${API_BASE_URL}/${endpoint}`;
};

// API endpoints
export const API_ENDPOINTS = {
  SESSION: {
    START: '/api/session/start',
    GET: (sessionId: string) => `/api/session/${sessionId}`,
    MODULES: (sessionId: string) => `/api/session/${sessionId}/modules`,
    COMPLETE_MODULE: (sessionId: string, moduleId: number) => `/api/session/${sessionId}/module/${moduleId}/complete`,
    QUIZ_SUBMIT: (sessionId: string) => `/api/session/${sessionId}/quiz/submit`,
    QUIZ_COMPLETE: (sessionId: string) => `/api/session/${sessionId}/quiz/complete`,
  },
  MODULE: {
    CONTENT: (moduleId: number) => `/api/module/${moduleId}/content`,
  },
  STATIC: {
    VIDEO: (filename: string) => `/api/videos/${filename}`,
    COMIC: (filename: string) => `/api/comics/${filename}`,
  }
}; 