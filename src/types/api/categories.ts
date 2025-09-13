export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string; // Relative path
  image_url: string; // Full URL
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  image: File | null;
}

export interface UpdateCategoryRequest {
  id: number;
  name: string;
  slug: string;
  image: File | null;
}