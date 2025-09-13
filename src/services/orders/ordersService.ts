import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Order, OrdersQueryParams, CheckoutRequest, PaginationResponse } from '../../types/api';

// API functions using AxiosConfig
const getOrders = async (): Promise<Order[]> => {
  const response = await AxiosConfig.get('/orders');
  return response.data;
};

const getOrderById = async (id: number): Promise<Order> => {
  const response = await AxiosConfig.get(`/orders/${id}`);
  return response.data;
};

const checkout = async (data: CheckoutRequest): Promise<Order> => {
  const response = await AxiosConfig.post('/orders/checkout', data);
  return response.data;
};

const updateOrderStatus = async (id: number, status: Order['status']): Promise<Order> => {
  const response = await AxiosConfig.put(`/orders/${id}/update`, { status });
  return response.data;
};

// Admin API functions
const getAllOrdersAdmin = async (params: OrdersQueryParams = {}): Promise<PaginationResponse<Order>> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'status' && Array.isArray(value)) {
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

// React Query hooks
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOrder = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Checkout error:', error);
    },
  });
};

// Admin hooks
export const useOrdersAdmin = (params: OrdersQueryParams = {}) => {
  return useQuery({
    queryKey: ['orders', 'admin', params],
    queryFn: () => getAllOrdersAdmin(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Order['status'] }) =>
      updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['order', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
    },
  });
};

// Legacy API for backward compatibility
export const orderAPI = {
  getAll: () => apiRequest("/orders"),
  getById: (id: number) => apiRequest(`/orders/${id}`),
  checkout: (data: CheckoutRequest) =>
    apiRequest("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiRequest(`/orders/${id}/update`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};