import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Review, CreateReviewRequest, UpdateReviewRequest, ReviewsQueryParams, PaginationResponse } from '../../types/api';

// API functions
const getReviewsByBook = async (bookId: number, params: ReviewsQueryParams = {}): Promise<PaginationResponse<Review>> => {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  
  const response = await AxiosConfig.get(
    `/books/${bookId}/reviews${queryString ? `?${queryString}` : ''}`
  );
  return response.data;
};

const createReview = async (bookId: number, data: CreateReviewRequest): Promise<Review> => {
  const response = await AxiosConfig.post(`/books/${bookId}/reviews`, data);
  return response.data;
};

const updateReview = async (data: UpdateReviewRequest): Promise<Review> => {
  const { id, ...updateData } = data;
  const response = await AxiosConfig.put(`/reviews/${id}`, updateData);
  return response.data;
};

const deleteReview = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/reviews/${id}`);
};

// React Query hooks
export const useReviews = (bookId: number, params: ReviewsQueryParams = {}) => {
  return useQuery({
    queryKey: ['reviews', bookId, params],
    queryFn: () => getReviewsByBook(bookId, params),
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, data }: { bookId: number; data: CreateReviewRequest }) =>
      createReview(bookId, data),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
    },
    onError: (error) => {
      console.error('Error creating review:', error);
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      console.error('Error updating review:', error);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
    },
  });
};

// Legacy API for backward compatibility
export const reviewAPI = {
  getByBook: (bookId: number, params: ReviewsQueryParams = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    return apiRequest(
      `/books/${bookId}/reviews${queryString ? `?${queryString}` : ""}`
    );
  },
  create: (bookId: number, data: CreateReviewRequest) =>
    apiRequest(`/books/${bookId}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Omit<UpdateReviewRequest, 'id'>) =>
    apiRequest(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest(`/reviews/${id}`, {
      method: "DELETE",
    }),
};