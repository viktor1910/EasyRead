/**
 * Payment validation utilities
 */

// Credit card type detection
export const getCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  
  const cardTypes = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$|^2[2-7][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    jcb: /^35[0-9]{14}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    dinersclub: /^3[0689][0-9]{11}$/
  };

  for (const [type, regex] of Object.entries(cardTypes)) {
    if (regex.test(number)) {
      return type;
    }
  }
  
  return 'unknown';
};

// Get card type display name
export const getCardTypeDisplayName = (cardType) => {
  const displayNames = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    jcb: 'JCB',
    discover: 'Discover',
    dinersclub: 'Diners Club',
    unknown: 'Unknown'
  };
  
  return displayNames[cardType] || 'Unknown';
};

// Luhn algorithm for credit card validation
export const isValidCardNumber = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(number)) {
    return false;
  }
  
  let sum = 0;
  let alternate = false;
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));
    
    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }
    
    sum += digit;
    alternate = !alternate;
  }
  
  return (sum % 10) === 0;
};

// Format card number with spaces
export const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Format expiry date MM/YY
export const formatExpiryDate = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 2) {
    return digits.substring(0, 2) + '/' + digits.substring(2, 4);
  }
  return digits;
};

// Validate expiry date
export const isValidExpiryDate = (expiryDate) => {
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return false;
  }
  
  const [month, year] = expiryDate.split('/').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  if (month < 1 || month > 12) {
    return false;
  }
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

// Validate CVV based on card type
export const isValidCVV = (cvv, cardType) => {
  if (!cvv || !/^\d+$/.test(cvv)) {
    return false;
  }
  
  // American Express has 4-digit CVV, others have 3
  const expectedLength = cardType === 'amex' ? 4 : 3;
  return cvv.length === expectedLength;
};

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Vietnamese format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  } else if (digits.length === 11) {
    return digits.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return digits;
};

// Coupon validation
export const validateCoupon = (couponCode) => {
  const validCoupons = {
    "SAVE10": {
      discount: 0.1,
      type: "percentage",
      description: "Giảm 10%",
      minOrder: 200000
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
      minOrder: 500000
    }
  };
  
  return validCoupons[couponCode.toUpperCase()] || null;
};

// Calculate discount amount
export const calculateDiscount = (subtotal, coupon) => {
  if (!coupon) return 0;
  
  if (subtotal < coupon.minOrder) {
    return 0;
  }
  
  if (coupon.type === "percentage") {
    return subtotal * coupon.discount;
  } else {
    return coupon.discount;
  }
};

// Price formatting
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Generate order number
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ER${timestamp.slice(-6)}${random}`;
};

// Delivery option validation
export const getDeliveryOptions = () => {
  return [
    {
      id: "standard",
      name: "Giao hàng tiêu chuẩn",
      description: "3-5 ngày làm việc",
      price: 30000,
      estimatedDays: "3-5"
    },
    {
      id: "express",
      name: "Giao hàng nhanh",
      description: "1-2 ngày làm việc",
      price: 50000,
      estimatedDays: "1-2"
    },
    {
      id: "same-day",
      name: "Giao hàng trong ngày",
      description: "Trong vòng 6 giờ (chỉ HN, HCM)",
      price: 80000,
      estimatedDays: "0",
      restrictedCities: ["Hà Nội", "TP. Hồ Chí Minh"]
    }
  ];
};

// Check if same-day delivery is available for city
export const isSameDayDeliveryAvailable = (city) => {
  const sameDayOption = getDeliveryOptions().find(option => option.id === "same-day");
  return sameDayOption.restrictedCities.includes(city);
};

// Calculate estimated delivery date
export const calculateDeliveryDate = (deliveryOption) => {
  const today = new Date();
  const deliveryOptions = getDeliveryOptions();
  const option = deliveryOptions.find(opt => opt.id === deliveryOption);
  
  if (!option) return null;
  
  if (option.id === "same-day") {
    return today;
  }
  
  const estimatedDays = parseInt(option.estimatedDays.split('-')[1] || option.estimatedDays);
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + estimatedDays);
  
  return deliveryDate;
};

// Vietnamese cities/provinces
export const getVietnameseCities = () => {
  return [
    "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
    "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
    "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
    "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
    "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
    "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
    "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
    "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
    "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
    "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
  ];
};
