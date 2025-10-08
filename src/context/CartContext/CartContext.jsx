import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../../AxiosConfig';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch active cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/carts/active/');

      // Transform backend response to match frontend expectations
      const cartData = {
        id: response.data.id,
        items: response.data.items || [],
        subtotal: response.data.subtotal || 0,
        items_count: response.data.items_count || 0,
        status: response.data.status
      };

      setCart(cartData);
      setError(null);
      return cartData; // Return cart data
    } catch (err) {
      console.error('Error fetching cart:', err);

      // If 404, user doesn't have active cart - create one
      if (err.response?.status === 404) {
        try {
          const createResponse = await axios.post('/carts/create/');
          const cartData = {
            id: createResponse.data.cart.id,
            items: [],
            subtotal: 0,
            items_count: 0,
            status: 'active'
          };
          setCart(cartData);
          setError(null);
          return cartData; // Return new cart data
        } catch (createErr) {
          console.error('Error creating cart:', createErr);
          setError('Không thể tạo giỏ hàng');
          setCart({ items: [], subtotal: 0, items_count: 0 });
          return null;
        }
      } else if (err.response?.status === 401) {
        setCart({ items: [], subtotal: 0, items_count: 0 });
        setError('Vui lòng đăng nhập để xem giỏ hàng');
        return null;
      } else {
        setError('Không thể tải giỏ hàng');
        setCart({ items: [], subtotal: 0, items_count: 0 });
        return null;
      }
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (motopartId, quantity = 1) => {
    try {
      setLoading(true);

      // Ensure we have a cart - use the returned cart data directly
      let currentCart = cart;
      if (!currentCart || !currentCart.id) {
        currentCart = await fetchCart();
      }

      // If fetchCart failed or returned null
      if (!currentCart || !currentCart.id) {
        throw new Error('Không thể tạo hoặc lấy giỏ hàng');
      }

      const response = await axios.post(`/cartitems/cart/${currentCart.id}/add/`, {
        motopart_id: motopartId,
        quantity: quantity
      });

      // Refresh cart after adding
      await fetchCart();
      setError(null);
      return { success: true, message: 'Đã thêm vào giỏ hàng' };
    } catch (err) {
      console.error('Error adding to cart:', err);

      if (err.response?.status === 401) {
        setError('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        return { success: false, error: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng' };
      }

      const errorMsg = err.response?.data?.message || err.message || 'Không thể thêm vào giỏ hàng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      return removeItem(itemId);
    }

    try {
      setLoading(true);

      const cartId = cart?.id;
      if (!cartId) {
        throw new Error('No active cart');
      }

      await axios.put(`/cartitems/cart/${cartId}/items/${itemId}/update/`, {
        quantity: newQuantity
      });

      // Refresh cart after updating
      await fetchCart();
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error updating quantity:', err);
      const errorMsg = err.response?.data?.message || 'Không thể cập nhật số lượng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      setLoading(true);

      const cartId = cart?.id;
      if (!cartId) {
        throw new Error('No active cart');
      }

      await axios.delete(`/cartitems/cart/${cartId}/items/${itemId}/remove/`);

      // Refresh cart after removing
      await fetchCart();
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error removing item:', err);
      const errorMsg = err.response?.data?.message || 'Không thể xóa sản phẩm';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);

      const cartId = cart?.id;
      if (!cartId) {
        throw new Error('No active cart');
      }

      await axios.delete(`/cartitems/cart/${cartId}/clear/`);

      // Refresh cart after clearing
      await fetchCart();
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error clearing cart:', err);
      const errorMsg = err.response?.data?.message || 'Không thể xóa giỏ hàng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Checkout
  const checkout = async (formData) => {
    try {
      setLoading(true);

      const cartId = cart?.id;
      if (!cartId) {
        throw new Error('No active cart');
      }

      const response = await axios.post(`/carts/${cartId}/checkout/`, formData);

      // Clear cart after successful checkout
      setCart({ items: [], subtotal: 0, items_count: 0 });
      setError(null);
      return { success: true, order: response.data.order };
    } catch (err) {
      console.error('Error during checkout:', err);
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi thanh toán';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Load cart on mount
  useEffect(() => {
    // Only fetch cart if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    } else {
      // If not logged in, set empty cart
      setCart({ items: [], subtotal: 0, items_count: 0 });
      setLoading(false);
    }
  }, []);

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
