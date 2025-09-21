import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Order, OrdersQueryParams, CreateOrderRequest, UpdateOrderStatusRequest, PaginationResponse } from '../../types/api';

// API functions using AxiosConfig (preferred)
const getOrders = async (params: OrdersQueryParams = {}): Promise<PaginationResponse<Order>> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, String(v)));
      } else {
        queryParams.set(key, String(value));
      }
    }
  });

  const response = await AxiosConfig.get(`/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  return response.data;
};

const getOrdersAdmin = async (params: OrdersQueryParams = {}): Promise<PaginationResponse<Order>> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, String(v)));
      } else {
        queryParams.set(key, String(value));
      }
    }
  });

  const response = await AxiosConfig.get(`/admin/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  return response.data;
};

const getOrderById = async (id: number): Promise<Order> => {
  const response = await AxiosConfig.get(`/orders/${id}`);
  return response.data;
};

const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  const response = await AxiosConfig.post('/orders/checkout', orderData);
  return response.data;
};

const updateOrderStatus = async (data: UpdateOrderStatusRequest): Promise<Order> => {
  const response = await AxiosConfig.put(`/orders/${data.id}/status`, {
    status: data.status,
  });
  return response.data;
};

// Legacy API functions using fetch (for backward compatibility)
const legacyOrderAPI = {
  getAll: (params: any = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, String(v)));
        } else {
          queryParams.set(key, String(value));
        }
      }
    });
    return apiRequest(`/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  },
  getAllAdmin: (params: any = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, String(v)));
        } else {
          queryParams.set(key, String(value));
        }
      }
    });
    return apiRequest(`/admin/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  },
  getById: (id: number) => apiRequest(`/orders/${id}`),
  checkout: (data: any) =>
    apiRequest("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStatus: (id: number, status: string) =>
    apiRequest(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// React Query hooks
export const useOrders = (params: OrdersQueryParams = {}, options: any = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
    enabled: !!localStorage.getItem('token'),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useOrdersAdmin = (params: OrdersQueryParams = {}, options: any = {}) => {
  return useQuery({
    queryKey: ['orders', 'admin', params],
    queryFn: () => getOrdersAdmin(params),
    enabled: !!localStorage.getItem('token'),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useOrder = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id && !!localStorage.getItem('token') && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error creating order:', error);
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
    },
  });
};

// Legacy hooks for backward compatibility
export const useOrdersQuery = (params: any = {}, options: any = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const response = await legacyOrderAPI.getAll(params);
      return response.data || response;
    },
    enabled: !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useOrdersAdminQuery = (params: any = {}, options: any = {}) => {
  return useQuery({
    queryKey: ["orders", "admin", params],
    queryFn: async () => {
      const response = await legacyOrderAPI.getAllAdmin(params);
      return response.data || response;
    },
    enabled: !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useOrderQuery = (id: number, options: any = {}) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => legacyOrderAPI.getById(id),
    enabled: !!id && !!localStorage.getItem("token"),
    ...options,
  });
};

export const useCheckoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => legacyOrderAPI.checkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      legacyOrderAPI.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });
};

// Direct API exports for compatibility
export const orderAPI = legacyOrderAPI;