import { useState, useCallback } from 'react';

/**
 * Custom hook for managing payment state throughout the payment flow
 */
const usePaymentState = (initialData = {}) => {
  const [paymentData, setPaymentData] = useState({
    cart: {
      items: [],
      subtotal: 0,
      shipping: 30000,
      tax: 0,
      discount: 0,
      total: 0,
      coupon: null,
      ...initialData.cart
    },
    shipping: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      ward: "",
      notes: "",
      deliveryOption: "standard",
      deliveryPrice: 30000,
      ...initialData.shipping
    },
    payment: {
      method: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
      ...initialData.payment
    },
    ...initialData
  });

  // Update a specific section of payment data
  const updatePaymentData = useCallback((section, data) => {
    setPaymentData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  }, []);

  // Update cart totals when cart items change
  const updateCartTotals = useCallback(() => {
    setPaymentData(prev => {
      const subtotal = prev.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = subtotal + prev.cart.shipping + prev.cart.tax - prev.cart.discount;
      
      return {
        ...prev,
        cart: {
          ...prev.cart,
          subtotal,
          total
        }
      };
    });
  }, []);

  // Add item to cart
  const addToCart = useCallback((item) => {
    setPaymentData(prev => {
      const existingItemIndex = prev.cart.items.findIndex(cartItem => cartItem.id === item.id);
      let updatedItems;

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        updatedItems = prev.cart.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        );
      } else {
        // Add new item
        updatedItems = [...prev.cart.items, { ...item, quantity: item.quantity || 1 }];
      }

      const subtotal = updatedItems.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0);
      const total = subtotal + prev.cart.shipping + prev.cart.tax - prev.cart.discount;

      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: updatedItems,
          subtotal,
          total
        }
      };
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((itemId) => {
    setPaymentData(prev => {
      const updatedItems = prev.cart.items.filter(item => item.id !== itemId);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = subtotal + prev.cart.shipping + prev.cart.tax - prev.cart.discount;

      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: updatedItems,
          subtotal,
          total
        }
      };
    });
  }, []);

  // Update item quantity
  const updateItemQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setPaymentData(prev => {
      const updatedItems = prev.cart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = subtotal + prev.cart.shipping + prev.cart.tax - prev.cart.discount;

      return {
        ...prev,
        cart: {
          ...prev.cart,
          items: updatedItems,
          subtotal,
          total
        }
      };
    });
  }, [removeFromCart]);

  // Apply coupon
  const applyCoupon = useCallback((couponCode, couponData) => {
    setPaymentData(prev => {
      let discount = 0;
      let shipping = prev.cart.shipping;

      if (couponData.type === "percentage") {
        discount = prev.cart.subtotal * couponData.discount;
      } else if (couponData.type === "fixed") {
        if (couponCode === "FREESHIP") {
          shipping = 0;
          discount = prev.cart.shipping;
        } else {
          discount = couponData.discount;
        }
      }

      const total = prev.cart.subtotal + shipping + prev.cart.tax - discount;

      return {
        ...prev,
        cart: {
          ...prev.cart,
          shipping,
          discount,
          total,
          coupon: { code: couponCode, ...couponData }
        }
      };
    });
  }, []);

  // Remove coupon
  const removeCoupon = useCallback(() => {
    setPaymentData(prev => {
      const shipping = 30000; // Reset to default shipping
      const total = prev.cart.subtotal + shipping + prev.cart.tax;

      return {
        ...prev,
        cart: {
          ...prev.cart,
          shipping,
          discount: 0,
          total,
          coupon: null
        }
      };
    });
  }, []);

  // Clear all payment data (useful for resetting)
  const clearPaymentData = useCallback(() => {
    setPaymentData({
      cart: {
        items: [],
        subtotal: 0,
        shipping: 30000,
        tax: 0,
        discount: 0,
        total: 0,
        coupon: null
      },
      shipping: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        notes: "",
        deliveryOption: "standard",
        deliveryPrice: 30000
      },
      payment: {
        method: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: ""
      }
    });
  }, []);

  // Get payment summary
  const getPaymentSummary = useCallback(() => {
    const { cart, shipping, payment } = paymentData;
    return {
      totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      discount: cart.discount,
      total: cart.total,
      hasValidShipping: shipping.fullName && shipping.email && shipping.phone && shipping.address,
      hasValidPayment: payment.method && (
        payment.method === 'cod' || 
        payment.method === 'bank-transfer' || 
        payment.method === 'digital-wallet' ||
        (payment.method === 'credit-card' && payment.cardNumber && payment.expiryDate && payment.cvv && payment.cardName)
      )
    };
  }, [paymentData]);

  return {
    paymentData,
    updatePaymentData,
    updateCartTotals,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    applyCoupon,
    removeCoupon,
    clearPaymentData,
    getPaymentSummary
  };
};

export default usePaymentState;
