// Category type for categories API
export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string; // Relative path từ server
  image_url: string; // Full URL từ server
  created_at: string;
  updated_at: string;
}
