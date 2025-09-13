import { User } from './auth';

export interface OrderItem {
  id: number;
  order_id: number;
  book_id: number;
  quantity: number;
  price: string; // API returns string
  book?: {
    id: number;
    title: string;
    slug: string;
    price: number;
    discount: number | null;
    stock: number;
    status: 'available' | 'out_of_stock';
    description: string;
    image_url: string;
    category_id: number | null;
    author_id: number;
    published_year: number;
    publisher: string;
    created_at: string;
    updated_at: string;
    image_full_url: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: string; // API returns string
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  shipping_address: string | null;
  payment_method: string | null;
  shipping_status: string | null;
  user?: User;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string[];
  user_id?: number;
  shipping_status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CheckoutRequest {
  shipping_address: string;
  payment_method: string;
}