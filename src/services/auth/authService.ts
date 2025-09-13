import { useMutation, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../types/api';

// Auth API functions
const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await AxiosConfig.post('/login', { email, password });
  return response.data;
};

const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await AxiosConfig.post('/register', data);
  return response.data;
};

const logout = async (): Promise<void> => {
  await AxiosConfig.post('/logout');
};

// React Query hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginRequest) => login(email, password),
    onSuccess: (data) => {
      // Store token and user info
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
      // Store token and user info
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
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Clear all queries
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Clear local storage even on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  });
};

// Direct API exports for compatibility
export const authAPI = {
  login,
  register,
  logout,
};