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
  id: number;
  name: string;
  slug: string;
  image: string | null; // Note: Django field is called 'image', not 'image_url'
  created_at: string;
  updated_at: string;
  motoparts_count: number; // Computed field from Django serializer
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

// Category-specific query parameters - matches Django filtering
export interface CategoriesQueryParams {
  page?: number;
  page_size?: number; // Match Django pagination parameter name
  search?: string; // Searches name and slug
  ordering?: string; // Django ordering format: 'name', '-created_at', etc.
}

// Pagination response structure from Django
export interface CategoryPaginationResponse {
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number;
    total_pages: number;
    page_size: number;
  };
  results: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  image?: string | null; // URL string to match Django field
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}