import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Motopart, MotopartsQueryParams, CreateMotopartRequest, UpdateMotopartRequest, PaginationResponse } from '../../types/api';

// API functions using AxiosConfig (preferred)
const getMotoparts = async (params: MotopartsQueryParams = {}): Promise<PaginationResponse<Motopart>> => {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const response = await AxiosConfig.get(`/motoparts${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

const getMotopartById = async (id: number): Promise<Motopart> => {
  const response = await AxiosConfig.get(`/motoparts/${id}`);
  return response.data;
};

const getMotopartBySlug = async (slug: string): Promise<Motopart> => {
  const response = await AxiosConfig.get(`/motoparts/slug/${slug}`);
  return response.data;
};

const createMotopart = async (motopartData: CreateMotopartRequest): Promise<Motopart> => {
  const formData = new FormData();
  
  Object.entries(motopartData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  const response = await AxiosConfig.post('/motoparts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const updateMotopart = async (motopartData: UpdateMotopartRequest): Promise<Motopart> => {
  const { id, ...updateData } = motopartData;
  const formData = new FormData();
  
  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  const response = await AxiosConfig.post(`/motoparts/${id}/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteMotopart = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/motoparts/${id}`);
};

const getMostOrderedMotoparts = async (): Promise<Motopart[]> => {
  const response = await AxiosConfig.get('/motoparts/most-ordered');
  return response.data;
};

// Legacy API functions using fetch (for backward compatibility)
const legacyMotopartAPI = {
  getAll: (params: any = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    return apiRequest(`/motoparts${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: number) => apiRequest(`/motoparts/${id}`),
  getBySlug: (slug: string) => apiRequest(`/motoparts/slug/${slug}`),
  create: (data: any) => {
    const isFormData = data instanceof FormData;
    return apiRequest('/motoparts', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  update: (id: number, data: any) => {
    const isFormData = data instanceof FormData;
    return apiRequest(`/motoparts/${id}`, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  delete: (id: number) =>
    apiRequest(`/motoparts/${id}`, {
      method: 'DELETE',
    }),
  getMostOrdered: () => apiRequest('/motoparts/most-ordered'),
};

// React Query hooks
export const useMotoparts = (params: MotopartsQueryParams = {}, options: any = {}) => {
  return useQuery({
    queryKey: ['motoparts', params],
    queryFn: () => getMotoparts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useMotopart = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['motopart', id],
    queryFn: () => getMotopartById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMotopartBySlug = (slug: string, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['motopart', 'slug', slug],
    queryFn: () => getMotopartBySlug(slug),
    enabled: !!slug && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMostOrderedMotoparts = (options: any = {}) => {
  return useQuery({
    queryKey: ['motoparts', 'most-ordered'],
    queryFn: () => getMostOrderedMotoparts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useCreateMotopart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMotopart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
      queryClient.removeQueries({ queryKey: ['motoparts'] });
    },
    onError: (error) => {
      console.error('Error creating motopart:', error);
    },
  });
};

export const useUpdateMotopart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMotopart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
      queryClient.invalidateQueries({ queryKey: ['motopart', data.id] });
      queryClient.removeQueries({ queryKey: ['motoparts'] });
    },
    onError: (error) => {
      console.error('Error updating motopart:', error);
    },
  });
};

export const useDeleteMotopart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMotopart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
      queryClient.removeQueries({ queryKey: ['motoparts'] });
    },
    onError: (error) => {
      console.error('Error deleting motopart:', error);
    },
  });
};

// Legacy hooks for backward compatibility
export const useMotopartsQuery = (params: any = {}, options: any = {}) => {
  return useQuery({
    queryKey: ['motoparts', params],
    queryFn: async () => {
      const response = await legacyMotopartAPI.getAll(params);
      return response.data || response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

export const useMotopartQuery = (id: number, options: any = {}) => {
  return useQuery({
    queryKey: ['motopart', id],
    queryFn: () => legacyMotopartAPI.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useMostOrderedMotopartsQuery = (options: any = {}) => {
  return useQuery({
    queryKey: ['motoparts', 'most-ordered'],
    queryFn: async () => {
      const response = await legacyMotopartAPI.getMostOrdered();
      return response.data || response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

export const useCreateMotopartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => legacyMotopartAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
    },
  });
};

export const useUpdateMotopartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => legacyMotopartAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
      queryClient.invalidateQueries({ queryKey: ['motopart', id] });
    },
  });
};

export const useDeleteMotopartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => legacyMotopartAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
    },
  });
};

// Direct API exports for compatibility
export const motopartAPI = legacyMotopartAPI;