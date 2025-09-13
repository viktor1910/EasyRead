export interface Book {
  id: number;
  title: string;
  slug: string;
  price: number;
  discount?: number | null;
  stock: number;
  status: 'available' | 'out_of_stock';
  description?: string;
  image?: string; // Relative path
  image_url?: string; // Full URL
  category_id: number;
  author_id?: number;
  published_year?: number;
  publisher?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateBookRequest {
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

export interface UpdateBookRequest {
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

export interface BooksQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  status?: 'available' | 'out_of_stock';
  sort?: string;
  order?: 'asc' | 'desc';
}