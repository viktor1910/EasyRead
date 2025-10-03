import { BaseEntity } from './common';
import { Category } from './books';

// Motopart types based on Django model and serializer
export interface Motopart extends BaseEntity {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  description?: string;
  image_url?: string;
  category: Category; // Always populated category object from serializer
  category_id: number; // For write operations
  manufacture_year: number;
  supplier: string;
  created_at: string;
  updated_at: string;
  discounted_price: number; // Computed property from backend
  is_available: boolean; // Computed property from backend
}

// Query parameters for motopart API - matches Django filtering
export interface MotopartsQueryParams {
  page?: number;
  page_size?: number; // Match Django pagination parameter name
  search?: string; // Searches name, description, supplier
  category?: number; // Category ID for filtering
  status?: 'active' | 'inactive' | 'out_of_stock';
  manufacture_year?: number;
  supplier?: string;
  ordering?: string; // Django ordering format: 'name', '-price', 'discounted_price', etc.
}

// Pagination response structure from Django
export interface MotopartPaginationResponse {
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number;
    total_pages: number;
    page_size: number;
  };
  results: Motopart[];
}

// Request types for creating motoparts
export interface CreateMotopartRequest {
  name: string;
  slug: string;
  price: number;
  discount?: number;
  stock: number;
  status?: 'active' | 'inactive' | 'out_of_stock';
  description?: string;
  image_url?: string;
  category_id: number; // Required for creating, matches Django serializer
  manufacture_year: number;
  supplier: string;
}

// Request types for updating motoparts
export interface UpdateMotopartRequest extends Partial<CreateMotopartRequest> {
  id: number;
}