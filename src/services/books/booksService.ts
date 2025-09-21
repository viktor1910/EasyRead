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

  const response = await AxiosConfig.get(`/books${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

const getBookById = async (id: number): Promise<Book> => {
  const response = await AxiosConfig.get(`/books/${id}`);
  return response.data;
};

const getBookBySlug = async (slug: string): Promise<Book> => {
  const response = await AxiosConfig.get(`/books/slug/${slug}`);
  return response.data;
};

const createBook = async (bookData: CreateBookRequest): Promise<Book> => {
  const formData = new FormData();
  formData.append('title', bookData.title);
  formData.append('slug', bookData.slug);
  formData.append('author', bookData.author);
  formData.append('price', String(bookData.price));
  formData.append('stock', String(bookData.stock));
  formData.append('status', bookData.status);
  formData.append('category_id', String(bookData.category_id));
  
  if (bookData.description) {
    formData.append('description', bookData.description);
  }
  if (bookData.discount) {
    formData.append('discount', String(bookData.discount));
  }
  if (bookData.image) {
    formData.append('image', bookData.image);
  }
  if (bookData.pdf) {
    formData.append('pdf', bookData.pdf);
  }
  
  const response = await AxiosConfig.post('/books', formData, {
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
  
  const response = await AxiosConfig.post(`/books/${id}/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteBook = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/books/${id}`);
};

const getMostOrderedBooks = async (): Promise<Book[]> => {
  const response = await AxiosConfig.get('/books/most-ordered');
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
    return apiRequest(`/books${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: number) => apiRequest(`/books/${id}`),
  getBySlug: (slug: string) => apiRequest(`/books/slug/${slug}`),
  create: (data: any) => {
    const isFormData = data instanceof FormData;
    return apiRequest('/books', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  update: (id: number, data: any) => {
    const isFormData = data instanceof FormData;
    return apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  delete: (id: number) =>
    apiRequest(`/books/${id}`, {
      method: 'DELETE',
    }),
  getMostOrdered: () => apiRequest('/books/most-ordered'),
};

// React Query hooks
export const useBooks = (params: BooksQueryParams = {}, options: any = {}) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => getBooks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useBook = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => getBookById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBookBySlug = (slug: string, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['book', 'slug', slug],
    queryFn: () => getBookBySlug(slug),
    enabled: !!slug && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMostOrderedBooks = (options: any = {}) => {
  return useQuery({
    queryKey: ['books', 'most-ordered'],
    queryFn: () => getMostOrderedBooks(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.removeQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      console.error('Error creating book:', error);
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', data.id] });
      queryClient.removeQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      console.error('Error updating book:', error);
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.removeQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      console.error('Error deleting book:', error);
    },
  });
};

// Legacy hooks for backward compatibility
export const useBooksQuery = (params: any = {}, options: any = {}) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: async () => {
      const response = await legacyBookAPI.getAll(params);
      return response.data || response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

export const useBookQuery = (id: number, options: any = {}) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => legacyBookAPI.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useMostOrderedBooksQuery = (options: any = {}) => {
  return useQuery({
    queryKey: ['books', 'most-ordered'],
    queryFn: async () => {
      const response = await legacyBookAPI.getMostOrdered();
      return response.data || response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => legacyBookAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUpdateBookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => legacyBookAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', id] });
    },
  });
};

export const useDeleteBookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => legacyBookAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

// Direct API exports for compatibility
export const bookAPI = legacyBookAPI;