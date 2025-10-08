import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../types/api';

// API functions using AxiosConfig (preferred)
const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await AxiosConfig.post('/users/login/', { email, password });
  return response.data;
};

const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await AxiosConfig.post('/users/register/', data);
  return response.data;
};

const logout = async (): Promise<void> => {
  await AxiosConfig.post('/users/logout/');
};

const getCurrentUser = async (): Promise<User> => {
  const response = await AxiosConfig.get('/users/me/');
  return response.data;
};

// Legacy API functions using fetch (for backward compatibility)
const legacyAuthAPI = {
  login: (email: string, password: string) =>
    apiRequest('/users/login/', {
      method: 'POST',
      body: { email, password },
    }),
  register: (data: any) =>
    apiRequest('/users/register/', {
      method: 'POST',
      body: data,
    }),
  logout: () =>
    apiRequest('/users/logout/', {
      method: 'POST',
    }),
  getCurrentUser: () => apiRequest('/users/me/'),
};

// React Query hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginRequest) => login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      queryClient.clear();
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      queryClient.clear();
      window.location.href = '/login';
    },
  });
};

export const useCurrentUser = (options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!localStorage.getItem('token') && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on auth failure
  });
};

// Legacy hooks for backward compatibility
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: any) => legacyAuthAPI.login(data.email, data.password),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: any) => legacyAuthAPI.register(data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
};

// Direct API exports for compatibility
export const authAPI = legacyAuthAPI;