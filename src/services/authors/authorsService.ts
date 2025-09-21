import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Author, CreateAuthorRequest, UpdateAuthorRequest } from '../../types/api';

// API functions using AxiosConfig (preferred)
const getAuthors = async (): Promise<Author[]> => {
  const response = await AxiosConfig.get('/authors');
  return response.data;
};

const getAuthorById = async (id: number): Promise<Author> => {
  const response = await AxiosConfig.get(`/authors/${id}`);
  return response.data;
};

const createAuthor = async (authorData: CreateAuthorRequest): Promise<Author> => {
  const formData = new FormData();
  formData.append('name', authorData.name);
  formData.append('slug', authorData.slug);
  if (authorData.biography) {
    formData.append('biography', authorData.biography);
  }
  if (authorData.image) {
    formData.append('image', authorData.image);
  }
  
  const response = await AxiosConfig.post('/authors', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const updateAuthor = async (authorData: UpdateAuthorRequest): Promise<Author> => {
  const { id, ...updateData } = authorData;
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
  
  const response = await AxiosConfig.put(`/authors/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteAuthor = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/authors/${id}`);
};

// Legacy API functions using fetch (for backward compatibility)
const legacyAuthorAPI = {
  getAll: () => apiRequest("/authors"),
  getById: (id: number) => apiRequest(`/authors/${id}`),
  create: (data: any) =>
    apiRequest("/authors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiRequest(`/authors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest(`/authors/${id}`, {
      method: "DELETE",
    }),
};

// React Query hooks
export const useAuthors = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: getAuthors,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAuthor = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['author', id],
    queryFn: () => getAuthorById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error) => {
      console.error('Error creating author:', error);
    },
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAuthor,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      queryClient.invalidateQueries({ queryKey: ['author', data.id] });
    },
    onError: (error) => {
      console.error('Error updating author:', error);
    },
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error) => {
      console.error('Error deleting author:', error);
    },
  });
};

// Legacy hooks for backward compatibility
export const useAuthorsQuery = (options: any = {}) => {
  return useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const response = await legacyAuthorAPI.getAll();
      return response.data || response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

export const useAuthorQuery = (id: number, options: any = {}) => {
  return useQuery({
    queryKey: ["author", id],
    queryFn: () => legacyAuthorAPI.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateAuthorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => legacyAuthorAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
};

export const useUpdateAuthorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => legacyAuthorAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      queryClient.invalidateQueries({ queryKey: ["author", id] });
    },
  });
};

export const useDeleteAuthorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => legacyAuthorAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
};

// Direct API exports for compatibility
export const authorAPI = legacyAuthorAPI;