import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { Book, CreateBookRequest, UpdateBookRequest, BooksQueryParams, PaginationResponse } from '../../types/api';

// API functions
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

const createBook = async (bookData: CreateBookRequest): Promise<Book> => {
  const formData = new FormData();
  formData.append('title', bookData.title);
  formData.append('slug', bookData.slug);
  formData.append('price', String(bookData.price));
  formData.append('stock', String(bookData.stock));
  formData.append('status', bookData.status);
  formData.append('category_id', String(bookData.category_id));
  formData.append('author_id', String(bookData.author_id));
  
  if (bookData.discount !== undefined) {
    formData.append('discount', String(bookData.discount));
  }
  
  if (bookData.description) {
    formData.append('description', bookData.description);
  }
  
  if (bookData.image) {
    formData.append('image', bookData.image);
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
  formData.append('title', updateData.title);
  formData.append('slug', updateData.slug);
  formData.append('price', String(updateData.price));
  formData.append('stock', String(updateData.stock));
  formData.append('status', updateData.status);
  formData.append('category_id', String(updateData.category_id));
  formData.append('author_id', String(updateData.author_id));
  
  if (updateData.discount !== undefined) {
    formData.append('discount', String(updateData.discount));
  }
  
  if (updateData.description) {
    formData.append('description', updateData.description);
  }
  
  if (updateData.image) {
    formData.append('image', updateData.image);
  }
  
  const response = await AxiosConfig.put(`/books/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteBook = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/books/${id}`);
};

// React Query hooks
export const useBooks = (params: BooksQueryParams = {}) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => getBooks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.setQueryData(['book', variables.id], data);
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

// Legacy compatibility exports
export const useBooksQuery = useBooks;
export const useBookQuery = useBook;
export const useCreateBookMutation = useCreateBook;
export const useUpdateBookMutation = useUpdateBook;
export const useDeleteBookMutation = useDeleteBook;