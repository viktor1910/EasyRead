import { BaseEntity } from './common';
import { Category } from './books';

// Motopart types based on Django model
export interface Motopart extends BaseEntity {
  name: string;
  slug: string;
  price: number;
  discount: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  description?: string;
  image_url?: string;
  category: Category | number; // Can be either a Category object or ID
  category_id?: number;
  manufacture_year: number;
  supplier: string;
}

export interface MotopartsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  supplier?: string;
  min_price?: number;
  max_price?: number;
  status?: 'active' | 'inactive' | 'out_of_stock';
  manufacture_year?: number;
  sort_by?: 'name' | 'price' | 'created_at' | 'manufacture_year' | 'stock';
  sort_order?: 'asc' | 'desc';
}

export interface CreateMotopartRequest {
  name: string;
  slug: string;
  price: number;
  discount?: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  description?: string;
  image_url?: string;
  category: number; // Category ID
  manufacture_year: number;
  supplier: string;
  image?: File;
}

export interface UpdateMotopartRequest extends Partial<CreateMotopartRequest> {
  id: number;
}