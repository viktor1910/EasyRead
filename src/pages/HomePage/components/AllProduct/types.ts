export interface Book {
  id: number;
  title: string;
  slug: string;
  price: number;
  discount: number | null;
  stock: number;
  status: 'available' | 'out_of_stock';
  description: string;
  image_url: string;
  category_id: number;
  author_id: number;
  published_year: number;
  publisher: string;
  created_at: string;
  updated_at: string;
  image_full_url: string;
}

export type BooksResponse = Book[];
