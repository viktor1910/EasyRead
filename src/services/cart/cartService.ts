import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, CheckoutRequest } from '../../types/api';

// API functions using AxiosConfig (preferred)
const getUserCarts = async (): Promise<Cart[]> => {
  const response = await AxiosConfig.get('/carts/');
  return response.data;
};

const getActiveCart = async (): Promise<Cart> => {
  const response = await AxiosConfig.get('/carts/active/');
  return response.data;
};

const getCartById = async (cartId: string): Promise<Cart> => {
  const response = await AxiosConfig.get(`/carts/${cartId}/`);
  return response.data;
};

const createCart = async (): Promise<Cart> => {
  const response = await AxiosConfig.post('/carts/create/', { status: 'active' });
  return response.data;
};

const getCartItems = async (cartId: string): Promise<CartItem[]> => {
  const response = await AxiosConfig.get(`/cartitems/cart/${cartId}/items/`);
  return response.data;
};

const addToCart = async (cartId: string, data: AddToCartRequest): Promise<CartItem> => {
  const response = await AxiosConfig.post(`/cartitems/cart/${cartId}/add/`, {
    motopart_id: data.book_id, // API uses motopart_id instead of book_id
    quantity: data.quantity,
  });
  return response.data;
};

const updateCartItem = async (cartId: string, itemId: string, quantity: number): Promise<CartItem> => {
  const response = await AxiosConfig.put(`/cartitems/cart/${cartId}/items/${itemId}/update/`, {
    quantity,
  });
  return response.data;
};

const removeCartItem = async (cartId: string, itemId: string): Promise<void> => {
  await AxiosConfig.delete(`/cartitems/cart/${cartId}/items/${itemId}/remove/`);
};

const clearCart = async (cartId: string): Promise<void> => {
  await AxiosConfig.delete(`/cartitems/cart/${cartId}/clear/`);
};

const checkoutCart = async (cartId: string, checkoutData: CheckoutRequest): Promise<any> => {
  const response = await AxiosConfig.post(`/carts/${cartId}/checkout/`, checkoutData);
  return response.data;
};

// Legacy API functions using fetch (for backward compatibility)
const legacyCartAPI = {
  get: () => apiRequest("/carts/active/"),
  getUserCarts: () => apiRequest("/carts/"),
  create: () => apiRequest("/carts/create/", {
    method: "POST",
    body: JSON.stringify({ status: "active" }),
  }),
  getItems: (cartId: string) => apiRequest(`/cartitems/cart/${cartId}/items/`),
  add: (cartId: string, bookId: number, quantity = 1) =>
    apiRequest(`/cartitems/cart/${cartId}/add/`, {
      method: "POST",
      body: JSON.stringify({ motopart_id: bookId, quantity }),
    }),
  update: (cartId: string, itemId: string, quantity: number) =>
    apiRequest(`/cartitems/cart/${cartId}/items/${itemId}/update/`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),
  remove: (cartId: string, itemId: string) =>
    apiRequest(`/cartitems/cart/${cartId}/items/${itemId}/remove/`, {
      method: "DELETE",
    }),
  clear: (cartId: string) =>
    apiRequest(`/cartitems/cart/${cartId}/clear/`, {
      method: "DELETE",
    }),
  checkout: (cartId: string, checkoutData: any) =>
    apiRequest(`/carts/${cartId}/checkout/`, {
      method: "POST",
      body: JSON.stringify(checkoutData),
    }),
};

// React Query hooks
export const useCart = (options: any = {}) => {
  return useQuery({
    queryKey: ['cart', 'active'],
    queryFn: getActiveCart,
    enabled: !!localStorage.getItem('token'),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useUserCarts = (options: any = {}) => {
  return useQuery({
    queryKey: ['carts'],
    queryFn: getUserCarts,
    enabled: !!localStorage.getItem('token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useCartById = (cartId: string, options: any = {}) => {
  return useQuery({
    queryKey: ['cart', cartId],
    queryFn: () => getCartById(cartId),
    enabled: !!cartId && !!localStorage.getItem('token'),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useCreateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error creating cart:', error);
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, data }: { cartId: string; data: AddToCartRequest }) => addToCart(cartId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['carts'] });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, itemId, quantity }: { cartId: string; itemId: string; quantity: number }) => 
      updateCartItem(cartId, itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['carts'] });
    },
    onError: (error) => {
      console.error('Error updating cart item:', error);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, itemId }: { cartId: string; itemId: string }) => removeCartItem(cartId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['carts'] });
    },
    onError: (error) => {
      console.error('Error removing cart item:', error);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string) => clearCart(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['carts'] });
    },
    onError: (error) => {
      console.error('Error clearing cart:', error);
    },
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, checkoutData }: { cartId: string; checkoutData: CheckoutRequest }) => 
      checkoutCart(cartId, checkoutData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['carts'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Error during checkout:', error);
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
    mutationFn: ({ bookId, quantity = 1 }: { bookId: number; quantity?: number }) =>
      legacyCartAPI.add(bookId.toString(), quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, itemId, quantity }: { cartId: string; itemId: number; quantity: number }) =>
      legacyCartAPI.update(cartId, itemId.toString(), quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, itemId }: { cartId: string; itemId: number }) =>
      legacyCartAPI.remove(cartId, itemId.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string) => legacyCartAPI.clear(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Direct API exports for compatibility
export const cartAPI = legacyCartAPI;