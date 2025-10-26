// HTTP Client using Axios for API communication
import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, ApiResponse, ApiErrorHandler } from './api';

// Create axios instance with default configuration
const httpClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor to add auth token
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 (Unauthorized) - Token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return httpClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(ApiErrorHandler.handle(error));
  }
);

// Generic API methods
export const apiClient = {
  // GET request
  get: async <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
    const response = await httpClient.get<ApiResponse<T>>(url, { params });
    return response.data.data as T;
  },

  // POST request
  post: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await httpClient.post<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  // PUT request
  put: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await httpClient.put<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await httpClient.patch<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  // DELETE request
  delete: async <T = any>(url: string): Promise<T> => {
    const response = await httpClient.delete<ApiResponse<T>>(url);
    return response.data.data as T;
  },
};

export default httpClient;