// Category type for categories API
export interface Category {
  id: number;
  name: string;
  slug: string | null;
  created_at: string;
  updated_at: string;
}
