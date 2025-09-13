import { User } from './auth';

export interface Review {
  id: number;
  book_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  id: number;
  rating: number;
  comment?: string;
}

export interface ReviewsQueryParams {
  page?: number;
  limit?: number;
  rating?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}