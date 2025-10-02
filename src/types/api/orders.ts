import { BaseEntity } from './common';
import { Book } from './books';
import { User } from './auth';

// Cart types
export interface CartItem extends BaseEntity {
  book_id: number;
  user_id: number;
  quantity: number;
  book?: Book;
}

export interface Cart {
  items: CartItem[];
  total_quantity: number;
  total_price: number;
}

export interface AddToCartRequest {
  book_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  id: number;
  quantity: number;
}

// Checkout types
export interface CheckoutRequest {
  shipping_address: string;
  payment_method: string;
}

// Order types
export interface Order extends BaseEntity {
  user_id: number;
  total_price: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  payment_method?: string;
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address?: string;
  notes?: string;
  user?: User;
  items?: OrderItem[];
}

export interface OrderItem extends BaseEntity {
  order_id: number;
  book_id: number;
  quantity: number;
  price: number;
  book?: Book;
}

export interface CreateOrderRequest {
  payment_method: string;
  shipping_address: string;
  notes?: string;
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string | string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface UpdateOrderStatusRequest {
  id: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
}