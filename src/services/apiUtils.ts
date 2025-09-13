import AxiosConfig from '../AxiosConfig';
import { ApiError } from '../types/api';

// API utility functions
const API_BASE_URL = "http://localhost:8000/api";

// Get auth headers from localStorage
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};

  // Don't set Content-Type for FormData, let browser set it with boundary
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Generic API fetch function
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Check if body is FormData
  const isFormData = options.body instanceof FormData;

  const config: RequestInit = {
    headers: getAuthHeaders(isFormData),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      // Token expired or invalid, clear storage but don't redirect automatically
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const errorData = await response.json();
      throw new Error(errorData.message || "Phiên đăng nhập đã hết hạn");
    }

    if (response.status === 403) {
      throw new Error("Bạn không có quyền truy cập");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Có lỗi xảy ra");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Alternative using AxiosConfig (recommended for consistency)
export const apiRequestAxios = async (method: string, endpoint: string, data?: any, config?: any) => {
  try {
    const response = await AxiosConfig({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};