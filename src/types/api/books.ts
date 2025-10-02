import { BaseEntity } from './common';

// Author interface
export interface Author extends BaseEntity {
  name: string;
  slug: string;
  biography?: string;
  image_url?: string;
  books_count?: number;
}

// Book types
export interface Book extends BaseEntity {
  title: string;
  slug: string;
  author: Author | string; // Can be either an Author object or string
  description?: string;
  price: number;
  discount?: number;
  stock: number;
  status: 'available' | 'out_of_stock';
  image_url?: string;
  category_id: number;
  category?: Category;
  average_rating?: number;
  reviews_count?: number;
  pdf_url?: string;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  books_count?: number;
}

export interface BooksQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  author?: string;
  min_price?: number;
  max_price?: number;
  status?: string;
  sort_by?: 'title' | 'price' | 'created_at' | 'average_rating';
  sort_order?: 'asc' | 'desc';
}

export interface CreateBookRequest {
  title: string;
  slug: string;
  author: string;
  description?: string;
  price: number;
  discount?: number;
  stock: number;
  status: 'available' | 'out_of_stock';
  category_id: number;
  image?: File;
  pdf?: File;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: number;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  image?: string; // URL string instead of File
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}