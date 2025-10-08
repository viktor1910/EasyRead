import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Book, BooksQueryParams, CreateBookRequest, UpdateBookRequest, PaginationResponse } from '../../types/api';

// API functions using AxiosConfig (preferred)
const getBooks = async (params: BooksQueryParams = {}): Promise<PaginationResponse<Book>> => {
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

const getBookById = async (id: number): Promise<Book> => {
  const response = await AxiosConfig.get(`/motoparts/${id}`);
  return response.data;
};

const getBookBySlug = async (slug: string): Promise<Book> => {
  const response = await AxiosConfig.get(`/motoparts/slug/${slug}`);
  return response.data;
};

const createBook = async (bookData: CreateBookRequest): Promise<Book> => {
  const formData = new FormData();
  
  Object.entries(bookData).forEach(([key, value]) => {
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

const updateBook = async (bookData: UpdateBookRequest): Promise<Book> => {
  const { id, ...updateData } = bookData;
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

const deleteBook = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/motoparts/${id}`);
};

const getMostOrderedBooks = async (): Promise<Book[]> => {
  const response = await AxiosConfig.get('/motoparts/most-ordered');
  return response.data;
};

// Legacy API functions using fetch (for backward compatibility)
const legacyBookAPI = {
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
export const useMotoparts = (params: BooksQueryParams = {}, options: any = {}) => {
  return useQuery({
    queryKey: ['motoparts', params],
    queryFn: () => getBooks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useMotopart = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['motopart', id],
    queryFn: () => getBookById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMotopartBySlug = (slug: string, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['motopart', 'slug', slug],
    queryFn: () => getBookBySlug(slug),
    enabled: !!slug && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMostOrderedMotoparts = (options: any = {}) => {
  return useQuery({
    queryKey: ['motoparts', 'most-ordered'],
    queryFn: () => getMostOrderedBooks(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useCreateMotopart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
      queryClient.removeQueries({ queryKey: ['motoparts'] });
    },
    onError: (error) => {
      console.error('Error creating book:', error);
    },
  });
};

export const useUpdateMotopart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
      queryClient.invalidateQueries({ queryKey: ['motopart', data.id] });
      queryClient.removeQueries({ queryKey: ['motoparts'] });
    },
    onError: (error) => {
      console.error('Error updating book:', error);
    },
  });
};

export const useDeleteMotopart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
      queryClient.removeQueries({ queryKey: ['motoparts'] });
    },
    onError: (error) => {
      console.error('Error deleting book:', error);
    },
  });
};

// Legacy hooks for backward compatibility
export const useMotopartsQuery = (params: any = {}, options: any = {}) => {
  return useQuery({
    queryKey: ['motoparts', params],
    queryFn: async () => {
      const response = await legacyBookAPI.getAll(params);
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
    queryFn: () => legacyBookAPI.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useMostOrderedMotopartsQuery = (options: any = {}) => {
  return useQuery({
    queryKey: ['motoparts', 'most-ordered'],
    queryFn: async () => {
      const response = await legacyBookAPI.getMostOrdered();
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
    mutationFn: (data: any) => legacyBookAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
    },
  });
};

export const useUpdateMotopartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => legacyBookAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
      queryClient.invalidateQueries({ queryKey: ['motopart', id] });
    },
  });
};

export const useDeleteMotopartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => legacyBookAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
    },
  });
};

// Direct API exports for compatibility
export const motopartAPI = legacyBookAPI;

// Backwards compatibility aliases (so existing imports keep working)
export const useBooks = useMotoparts;
export const useBook = useMotopart;
export const useBookBySlug = useMotopartBySlug;
export const useMostOrderedBooks = useMostOrderedMotoparts;
export const useCreateBook = useCreateMotopart;
export const useUpdateBook = useUpdateMotopart;
export const useDeleteBook = useDeleteMotopart;
export const useBooksQuery = useMotopartsQuery;
export const useBookQuery = useMotopartQuery;
export const useMostOrderedBooksQuery = useMostOrderedMotopartsQuery;
export const useCreateBookMutation = useCreateMotopartMutation;
export const useUpdateBookMutation = useUpdateMotopartMutation;
export const useDeleteBookMutation = useDeleteMotopartMutation;
export const bookAPI = legacyBookAPI; // keep old name as alias