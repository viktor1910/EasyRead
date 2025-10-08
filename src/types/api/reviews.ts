import { BaseEntity } from './common';
import { Motopart } from './motoparts';
import { User } from './auth';

// Review types
export interface Review extends BaseEntity {
  motopart_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  motopart?: Motopart;
  user?: User;
}

export interface CreateReviewRequest {
  book_id: number;
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
  book_id?: number;
  motopart_id?: number;
  user_id?: number;
  rating?: number;
}

// Author types  
export interface Author extends BaseEntity {
  name: string;
  slug: string;
  biography?: string;
  image_url?: string;
  books_count?: number;
}

export interface CreateAuthorRequest {
  name: string;
  slug: string;
  biography?: string;
  image?: File;
}

export interface UpdateAuthorRequest extends Partial<CreateAuthorRequest> {
  id: number;
}