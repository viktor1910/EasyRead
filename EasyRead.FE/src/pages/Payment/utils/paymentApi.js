/**
 * Payment API utilities and mock implementations
 * In a real application, these would connect to actual payment gateways
 */

// Mock API delay
const mockApiDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock payment processing for different methods
export const processPayment = async (paymentData) => {
  await mockApiDelay(2000); // Simulate API call
  
  const { payment, cart, shipping } = paymentData;
  
  try {
    switch (payment.method) {
      case 'credit-card':
        return await processCreditCardPayment(payment, cart.total);
      
      case 'bank-transfer':
        return await processBankTransferPayment(cart.total, shipping.email);
      
      case 'cod':
        return await processCODPayment(cart.total);
      
      case 'digital-wallet':
        return await processDigitalWalletPayment(cart.total);
      
      default:
        throw new Error('Phương thức thanh toán không được hỗ trợ');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

// Credit card payment processing
const processCreditCardPayment = async (paymentInfo, amount) => {
  await mockApiDelay(1500);
  
  // Simulate payment gateway validation
  const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
  
  // Mock validation: fail if card number ends with 0000
  if (cardNumber.endsWith('0000')) {
    throw new Error('Thẻ bị từ chối. Vui lòng kiểm tra thông tin thẻ hoặc liên hệ ngân hàng.');
  }
  
  // Mock validation: fail if amount > 10,000,000
  if (amount > 10000000) {
    throw new Error('Số tiền vượt quá hạn mức thanh toán. Vui lòng chọn phương thức khác.');
  }
  
  return {
    success: true,
    transactionId: `CC_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    message: 'Thanh toán thành công',
    method: 'credit-card',
    amount,
    processedAt: new Date().toISOString()
  };
};

// Bank transfer payment processing
const processBankTransferPayment = async (amount, email) => {
  await mockApiDelay(1000);
  
  // Generate transfer reference
  const transferRef = `BT_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  
  return {
    success: true,
    transactionId: transferRef,
    message: 'Thông tin chuyển khoản đã được gửi đến email của bạn',
    method: 'bank-transfer',
    amount,
    transferReference: transferRef,
    processedAt: new Date().toISOString(),
    instructions: {
      bankAccounts: [
        {
          bankName: "Vietcombank",
          accountNumber: "1234567890",
          accountName: "CONG TY TNHH EASYREAD",
          branch: "Chi nhánh Hà Nội"
        },
        {
          bankName: "Techcombank",
          accountNumber: "0987654321",
          accountName: "CONG TY TNHH EASYREAD",
          branch: "Chi nhánh TP.HCM"
        }
      ],
      transferNote: `EasyRead ${transferRef}`,
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }
  };
};

// COD payment processing
const processCODPayment = async (amount) => {
  await mockApiDelay(500);
  
  return {
    success: true,
    transactionId: `COD_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    message: 'Đơn hàng đã được xác nhận. Bạn sẽ thanh toán khi nhận hàng.',
    method: 'cod',
    amount,
    processedAt: new Date().toISOString()
  };
};

// Digital wallet payment processing
const processDigitalWalletPayment = async (amount) => {
  await mockApiDelay(1500);
  
  // Mock: randomly fail 10% of the time
  if (Math.random() < 0.1) {
    throw new Error('Thanh toán qua ví điện tử thất bại. Vui lòng thử lại.');
  }
  
  return {
    success: true,
    transactionId: `DW_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    message: 'Thanh toán qua ví điện tử thành công',
    method: 'digital-wallet',
    amount,
    processedAt: new Date().toISOString()
  };
};

// Verify coupon with backend
export const verifyCoupon = async (couponCode, cartTotal) => {
  await mockApiDelay(800);
  
  const validCoupons = {
    "SAVE10": {
      discount: 0.1,
      type: "percentage",
      description: "Giảm 10%",
      minOrder: 200000,
      maxDiscount: 500000
    },
    "FREESHIP": {
      discount: 30000,
      type: "fixed",
      description: "Miễn phí vận chuyển",
      minOrder: 0
    },
    "NEWUSER": {
      discount: 50000,
      type: "fixed",
      description: "Giảm 50.000đ cho khách hàng mới",
      minOrder: 300000
    },
    "SAVE20": {
      discount: 0.2,
      type: "percentage",
      description: "Giảm 20%",
      minOrder: 500000,
      maxDiscount: 1000000
    },
    "BLACKFRIDAY": {
      discount: 0.25,
      type: "percentage",
      description: "Black Friday - Giảm 25%",
      minOrder: 1000000,
      maxDiscount: 2000000,
      expiry: new Date('2024-12-31').toISOString()
    }
  };
  
  const coupon = validCoupons[couponCode.toUpperCase()];
  
  if (!coupon) {
    throw new Error('Mã giảm giá không tồn tại');
  }
  
  // Check expiry
  if (coupon.expiry && new Date() > new Date(coupon.expiry)) {
    throw new Error('Mã giảm giá đã hết hạn');
  }
  
  // Check minimum order
  if (cartTotal < coupon.minOrder) {
    throw new Error(`Đơn hàng tối thiểu ${formatPrice(coupon.minOrder)} để sử dụng mã này`);
  }
  
  // Calculate actual discount
  let discountAmount = 0;
  if (coupon.type === "percentage") {
    discountAmount = cartTotal * coupon.discount;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discount;
  }
  
  return {
    success: true,
    coupon: {
      ...coupon,
      code: couponCode.toUpperCase(),
      discountAmount
    }
  };
};

// Check order status
export const checkOrderStatus = async (orderNumber) => {
  await mockApiDelay(1000);
  
  // Mock order statuses
  const statuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    orderNumber,
    status: randomStatus,
    statusText: getStatusText(randomStatus),
    updatedAt: new Date().toISOString(),
    trackingNumber: randomStatus === 'shipped' || randomStatus === 'delivered' 
      ? `TRK${Date.now().toString().slice(-8)}` 
      : null
  };
};

// Get shipping rates
export const getShippingRates = async (address) => {
  await mockApiDelay(800);
  
  const baseRates = [
    {
      id: "standard",
      name: "Giao hàng tiêu chuẩn",
      price: 30000,
      estimatedDays: "3-5"
    },
    {
      id: "express",
      name: "Giao hàng nhanh",
      price: 50000,
      estimatedDays: "1-2"
    }
  ];
  
  // Add same-day delivery for major cities
  if (address.city === "Hà Nội" || address.city === "TP. Hồ Chí Minh") {
    baseRates.push({
      id: "same-day",
      name: "Giao hàng trong ngày",
      price: 80000,
      estimatedDays: "0"
    });
  }
  
  return {
    success: true,
    rates: baseRates
  };
};

// Save order to backend
export const saveOrder = async (orderData) => {
  await mockApiDelay(1500);
  
  const orderNumber = `ER${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 3).toUpperCase()}`;
  
  return {
    success: true,
    orderNumber,
    orderData: {
      ...orderData,
      orderNumber,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
  };
};

// Send order confirmation email
export const sendOrderConfirmation = async (orderData, email) => {
  await mockApiDelay(1000);
  
  // Mock email sending
  console.log(`Order confirmation email sent to ${email}`);
  
  return {
    success: true,
    message: 'Email xác nhận đã được gửi'
  };
};

// Helper functions
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const getStatusText = (status) => {
  const statusTexts = {
    confirmed: 'Đã xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy'
  };
  return statusTexts[status] || 'Không xác định';
};

// Export all functions
export default {
  processPayment,
  verifyCoupon,
  checkOrderStatus,
  getShippingRates,
  saveOrder,
  sendOrderConfirmation
};
