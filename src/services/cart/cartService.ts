import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Cart, CartItem, AddToCartRequest, UpdateCartRequest } from '../../types/api';

// API functions using AxiosConfig
const getCart = async (): Promise<Cart> => {
  const response = await AxiosConfig.get('/cart');
  return response.data;
};

const addToCart = async (data: AddToCartRequest): Promise<CartItem> => {
  const response = await AxiosConfig.post('/cart/add', data);
  return response.data;
};

const updateCartItem = async (itemId: number, data: UpdateCartRequest): Promise<CartItem> => {
  const response = await AxiosConfig.put(`/cart/update/${itemId}`, data);
  return response.data;
};

const removeFromCart = async (itemId: number): Promise<void> => {
  await AxiosConfig.delete(`/cart/remove/${itemId}`);
};

const clearCart = async (): Promise<void> => {
  await AxiosConfig.delete('/cart/clear');
};

// React Query hooks
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 0, // Always refetch cart data
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

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItem(itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error updating cart:', error);
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error removing from cart:', error);
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

// Legacy API for backward compatibility
export const cartAPI = {
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