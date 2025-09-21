import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '../../types/api';

// API functions using AxiosConfig (preferred)
const getCart = async (): Promise<Cart> => {
  const response = await AxiosConfig.get('/cart');
  return response.data;
};

const addToCart = async (data: AddToCartRequest): Promise<CartItem> => {
  const response = await AxiosConfig.post('/cart/add', data);
  return response.data;
};

const updateCartItem = async (data: UpdateCartItemRequest): Promise<CartItem> => {
  const response = await AxiosConfig.put(`/cart/update/${data.id}`, {
    quantity: data.quantity,
  });
  return response.data;
};

const removeCartItem = async (itemId: number): Promise<void> => {
  await AxiosConfig.delete(`/cart/remove/${itemId}`);
};

const clearCart = async (): Promise<void> => {
  await AxiosConfig.delete('/cart/clear');
};

// Legacy API functions using fetch (for backward compatibility)
const legacyCartAPI = {
  get: () => apiRequest("/cart"),
  add: (bookId: number, quantity = 1) =>
    apiRequest("/cart/add", {
      method: "POST",
      body: JSON.stringify({ book_id: bookId, quantity }),
    }),
  update: (itemId: number, quantity: number) =>
    apiRequest(`/cart/update/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),
  remove: (itemId: number) =>
    apiRequest(`/cart/remove/${itemId}`, {
      method: "DELETE",
    }),
  clear: () =>
    apiRequest("/cart/clear", {
      method: "DELETE",
    }),
};

// React Query hooks
export const useCart = (options: any = {}) => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!localStorage.getItem('token'),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error updating cart item:', error);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error removing cart item:', error);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error clearing cart:', error);
    },
  });
};

// Legacy hooks for backward compatibility
export const useCartQuery = (options: any = {}) => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await legacyCartAPI.get();
      return response.data || response;
    },
    enabled: !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, quantity }: { bookId: number; quantity?: number }) =>
      legacyCartAPI.add(bookId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      legacyCartAPI.update(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => legacyCartAPI.remove(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => legacyCartAPI.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Direct API exports for compatibility
export const cartAPI = legacyCartAPI;