import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Author, CreateAuthorRequest, UpdateAuthorRequest } from '../../types/api';

// API functions
const getAuthors = async (): Promise<Author[]> => {
  const response = await AxiosConfig.get('/authors');
  return response.data;
};

const getAuthorById = async (id: number): Promise<Author> => {
  const response = await AxiosConfig.get(`/authors/${id}`);
  return response.data;
};

const createAuthor = async (data: CreateAuthorRequest): Promise<Author> => {
  const response = await AxiosConfig.post('/authors', data);
  return response.data;
};

const updateAuthor = async (data: UpdateAuthorRequest): Promise<Author> => {
  const { id, ...updateData } = data;
  const response = await AxiosConfig.put(`/authors/${id}`, updateData);
  return response.data;
};

const deleteAuthor = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/authors/${id}`);
};

// React Query hooks
export const useAuthors = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: getAuthors,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAuthor = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['author', id],
    queryFn: () => getAuthorById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 10 * 60 * 1000, // 10 minutes
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      queryClient.setQueryData(['author', variables.id], data);
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

// Legacy API for backward compatibility
export const authorAPI = {
  getAll: () => apiRequest("/authors"),
  getById: (id: number) => apiRequest(`/authors/${id}`),
  create: (data: CreateAuthorRequest) =>
    apiRequest("/authors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Omit<UpdateAuthorRequest, 'id'>) =>
    apiRequest(`/authors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest(`/authors/${id}`, {
      method: "DELETE",
    }),
};