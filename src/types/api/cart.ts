export interface CartItem {
  id: number;
  book_id: number;
  quantity: number;
  book: {
    id: number;
    title: string;
    slug: string;
    price: number;
    discount?: number | null;
    image_url?: string;
    stock: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Cart {
  items: CartItem[];
  total_price: number;
  total_items: number;
}

export interface AddToCartRequest {
  book_id: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}