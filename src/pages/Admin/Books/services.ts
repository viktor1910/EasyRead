import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../../AxiosConfig';

// Interface cho Book model
export interface Book {
  id?: number;
  title: string;
  slug: string;
  price: number;
  discount?: number;
  stock: number;
  status: 'available' | 'out_of_stock';
  description?: string;
  image?: string; // Relative path từ server
  image_url?: string; // Full URL từ server
  category_id: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Interface cho dữ liệu khi tạo book
export interface CreateBookData {
  title: string;
  slug: string;
  price: number;
  discount?: number;
  stock: number;
  status: 'available' | 'out_of_stock';
  description?: string;
  category_id: number;
  author_id: number;
  image?: File | null;
}

// Interface cho dữ liệu khi update book
export interface UpdateBookData {
  id: number;
  title: string;
  slug: string;
  price: number;
  discount?: number;
  stock: number;
  status: 'available' | 'out_of_stock';
  description?: string;
  category_id: number;
  author_id: number;
  image?: File | null;
}

// Interface cho query parameters
export interface BooksQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  status?: 'available' | 'out_of_stock';
  sort?: string;
  order?: 'asc' | 'desc';
}

// API function để get books với pagination và filter
const getBooks = async (params: BooksQueryParams = {}): Promise<{
  data: Book[];
  total: number;
  page: number;
  limit: number;
}> => {
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

// API function để get book by id
const getBookById = async (id: number): Promise<Book> => {
  const response = await AxiosConfig.get(`/books/${id}`);
  return response.data;
};

// API function để create book
const createBook = async (bookData: CreateBookData): Promise<Book> => {
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

// API function để update book
const updateBook = async (bookData: UpdateBookData): Promise<Book> => {
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

// API function để delete book
const deleteBook = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/books/${id}`);
};

// React Query hook để get books với pagination
export const useBooks = (params: BooksQueryParams = {}) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => getBooks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// React Query hook để get book by id
export const useBook = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => getBookById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// React Query hook để create book
export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      // Invalidate và refetch books list sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ['books'] });
      // Remove specific query cache if needed
      queryClient.removeQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      console.error('Error creating book:', error);
    },
  });
};

// React Query hook để update book
export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBook,
    onSuccess: (data, variables) => {
      // Invalidate và refetch books list sau khi update thành công
      queryClient.invalidateQueries({ queryKey: ['books'] });
      // Update specific book cache
      queryClient.setQueryData(['book', variables.id], data);
      // Remove books list cache để force refetch
      queryClient.removeQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      console.error('Error updating book:', error);
    },
  });
};

// React Query hook để delete book
export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      // Invalidate và refetch books list sau khi delete thành công
      queryClient.invalidateQueries({ queryKey: ['books'] });
      // Remove specific query cache if needed
      queryClient.removeQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      console.error('Error deleting book:', error);
    },
  });
};
