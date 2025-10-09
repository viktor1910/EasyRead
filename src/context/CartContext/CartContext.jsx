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
      const response = await axios.get('/carts/active/');
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);

      // Nếu lỗi 404, chưa có cart active -> tạo mới
      if (err.response?.status === 404) {
        try {
          const createResponse = await axios.post('/carts/create/');
          setCart(createResponse.data.cart);
          setError(null);
        } catch (createErr) {
          console.error('Error creating cart:', createErr);
          setCart({ items: [], subtotal: 0, items_count: 0 });
          setError('Không thể tạo giỏ hàng');
        }
      } else if (err.response?.status === 401) {
        // Nếu lỗi 401, user chưa đăng nhập
        setCart({ items: [], subtotal: 0, items_count: 0 });
        setError('Vui lòng đăng nhập để xem giỏ hàng');
      } else {
        setError('Không thể tải giỏ hàng');
        setCart({ items: [], subtotal: 0, items_count: 0 });
      }
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (motopartId, quantity = 1) => {
    try {
      setLoading(true);

      // Ensure we have an active cart
      let activeCart = cart;
      if (!activeCart || !activeCart.id) {
        await fetchCart();
        activeCart = cart;
      }

      // If still no cart, try to create one
      if (!activeCart || !activeCart.id) {
        const createResponse = await axios.post('/carts/create/');
        activeCart = createResponse.data.cart;
        setCart(activeCart);
      }

      const response = await axios.post(`/cartitems/cart/${activeCart.id}/add/`, {
        motopart_id: motopartId,
        quantity: quantity
      });

      // Refresh cart data after adding
      await fetchCart();

      setError(null);
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('Error adding to cart:', err);

      // Nếu lỗi 401, user chưa đăng nhập
      if (err.response?.status === 401) {
        setError('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        return { success: false, message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng' };
      }

      const errorMsg = err.response?.data?.message || 'Không thể thêm vào giỏ hàng';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 0) return { success: false, error: 'Số lượng không hợp lệ' };

    if (!cart || !cart.id) {
      return { success: false, error: 'Không tìm thấy giỏ hàng' };
    }

    try {
      setLoading(true);
      const response = await axios.put(`/cartitems/cart/${cart.id}/items/${itemId}/update/`, {
        quantity: newQuantity
      });

      // Refresh cart
      await fetchCart();

      setError(null);
      return { success: true, message: response.data.message };
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
    if (!cart || !cart.id) {
      return { success: false, error: 'Không tìm thấy giỏ hàng' };
    }

    try {
      setLoading(true);
      const response = await axios.delete(`/cartitems/cart/${cart.id}/items/${itemId}/remove/`);

      // Refresh cart
      await fetchCart();

      setError(null);
      return { success: true, message: response.data.message };
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
    if (!cart || !cart.id) {
      return { success: false, error: 'Không tìm thấy giỏ hàng' };
    }

    try {
      setLoading(true);
      await axios.delete(`/cartitems/cart/${cart.id}/clear/`);

      // Refresh cart
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
    if (!cart || !cart.id) {
      return { success: false, message: 'Không tìm thấy giỏ hàng' };
    }

    try {
      setLoading(true);
      const response = await axios.post(`/carts/${cart.id}/checkout/`, formData);

      // Refresh cart after checkout (should be checked_out status now)
      await fetchCart();

      setError(null);
      return { success: true, order: response.data.order, message: response.data.message };
    } catch (err) {
      console.error('Error during checkout:', err);
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi thanh toán';
      setError(errorMsg);
      return { success: false, message: errorMsg };
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
