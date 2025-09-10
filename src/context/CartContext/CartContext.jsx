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

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/cart/');
      setCart(response.data.cart);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      
      // Nếu lỗi 401, user chưa đăng nhập
      if (err.response?.status === 401) {
        setCart({ items: [], subtotal: 0, items_count: 0 });
        setError('Vui lòng đăng nhập để xem giỏ hàng');
      } else {
        setError('Không thể tải giỏ hàng');
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (bookId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await axios.post('/cart/add', {
        book_id: bookId,
        quantity: quantity
      });
      setCart(response.data);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error adding to cart:', err);
      
      // Nếu lỗi 401, user chưa đăng nhập
      if (err.response?.status === 401) {
        setError('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        return { success: false, error: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng' };
      }
      
      setError(err.response?.data?.message || 'Không thể thêm vào giỏ hàng');
      return { success: false, error: err.response?.data?.message || 'Không thể thêm vào giỏ hàng' };
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 0) return { success: false, error: 'Số lượng không hợp lệ' };
    
    try {
      setLoading(true);
      const response = await axios.put(`/cart/update/${itemId}`, {
        quantity: newQuantity
      });
      setCart(response.data);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật số lượng');
      return { success: false, error: err.response?.data?.message || 'Không thể cập nhật số lượng' };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/cart/remove/${itemId}`);
      setCart(response.data);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err.response?.data?.message || 'Không thể xóa sản phẩm');
      return { success: false, error: err.response?.data?.message || 'Không thể xóa sản phẩm' };
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      await axios.delete('/cart/clear');
      setCart({ items: [], subtotal: 0, items_count: 0 });
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.response?.data?.message || 'Không thể xóa giỏ hàng');
      return { success: false, error: err.response?.data?.message || 'Không thể xóa giỏ hàng' };
    } finally {
      setLoading(false);
    }
  };

  // Checkout
  const checkout = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post('/orders/checkout', formData);
      // Clear cart after successful checkout
      setCart({ items: [], subtotal: 0, items_count: 0 });
      setError(null);
      return { success: true, order: response.data };
    } catch (err) {
      console.error('Error during checkout:', err);
      setError(err.response?.data?.error || 'Có lỗi xảy ra khi thanh toán');
      return { success: false, error: err.response?.data?.error || 'Có lỗi xảy ra khi thanh toán' };
    } finally {
      setLoading(false);
    }
  };

  // Load cart on mount
  useEffect(() => {
    // Chỉ fetch cart nếu user đã đăng nhập
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    } else {
      // Nếu chưa đăng nhập, set empty cart
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
