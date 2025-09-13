import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../../AxiosConfig';

// Interface cho Order model
export interface Order {
  id?: number;
  user_id: number;
  total_price: string; // API trả về string, không phải number
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  shipping_address: string | null;
  payment_method: string | null;
  shipping_status: string | null;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: string;
    is_active: number;
    created_at: string;
    updated_at: string;
  };
  items?: OrderItem[]; // Trong API response là "items", không phải "order_items"
}

// Interface cho Order Item
export interface OrderItem {
  id?: number;
  order_id: number;
  book_id: number;
  quantity: number;
  price: string; // API trả về string, không phải number
  created_at?: string;
  updated_at?: string;
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
}

// Interface cho query parameters
export interface OrdersQueryParams {
  page?: number;
  limit?: number; // hoặc per_page tùy theo API backend
  search?: string;
  status?: string[]; // Array of status values - sẽ được convert thành comma-separated string
  user_id?: number;
  shipping_status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// API response interface - Laravel pagination format
export interface OrdersResponse {
  current_page: number;
  data: Order[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// API function để get all orders với pagination và filter
const getAllOrders = async (params: OrdersQueryParams = {}): Promise<OrdersResponse> => {
  const queryParams = new URLSearchParams();
  
  // Handle basic parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'status' && Array.isArray(value)) {
        // Convert status array to comma-separated string
        if (value.length > 0) {
          queryParams.append('status', value.join(','));
        }
      } else if (!Array.isArray(value)) {
        queryParams.append(key, String(value));
      }
    }
  });
  
  const queryString = queryParams.toString();
  const response = await AxiosConfig.get(`/orders/admin/listall${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

// API function để get order by id
const getOrderById = async (id: number): Promise<Order> => {
  const response = await AxiosConfig.get(`/orders/${id}`);
  return response.data;
};

// API function để update order status
const updateOrderStatus = async (id: number, status: Order['status']): Promise<Order> => {
  const response = await AxiosConfig.put(`/orders/${id}/update`, { status });
  return response.data;
};

// React Query hook để get all orders với pagination
export const useOrders = (params: OrdersQueryParams = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getAllOrders(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// React Query hook để get order by id
export const useOrder = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// React Query hook để update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Order['status'] }) =>
      updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      // Update specific order cache
      queryClient.setQueryData(['order', variables.id], data);
      // Invalidate orders list để refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
    },
  });
};