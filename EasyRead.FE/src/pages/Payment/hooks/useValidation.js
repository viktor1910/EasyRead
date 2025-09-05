import { useState, useCallback } from 'react';

/**
 * Custom hook for form validation in payment flow
 */
const useValidation = () => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validationRules = {
    // Shipping validation
    fullName: (value) => {
      if (!value || value.trim().length < 2) {
        return 'Họ tên phải có ít nhất 2 ký tự';
      }
      return '';
    },

    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        return 'Email là bắt buộc';
      }
      if (!emailRegex.test(value)) {
        return 'Email không hợp lệ';
      }
      return '';
    },

    phone: (value) => {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!value) {
        return 'Số điện thoại là bắt buộc';
      }
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Số điện thoại không hợp lệ (10-11 chữ số)';
      }
      return '';
    },

    address: (value) => {
      if (!value || value.trim().length < 10) {
        return 'Địa chỉ phải có ít nhất 10 ký tự';
      }
      return '';
    },

    city: (value) => {
      if (!value) {
        return 'Vui lòng chọn tỉnh/thành phố';
      }
      return '';
    },

    district: (value) => {
      if (!value || value.trim().length < 2) {
        return 'Vui lòng nhập quận/huyện';
      }
      return '';
    },

    ward: (value) => {
      if (!value || value.trim().length < 2) {
        return 'Vui lòng nhập phường/xã';
      }
      return '';
    },

    // Payment validation
    paymentMethod: (value) => {
      if (!value) {
        return 'Vui lòng chọn phương thức thanh toán';
      }
      return '';
    },

    cardNumber: (value) => {
      if (!value) {
        return 'Số thẻ là bắt buộc';
      }
      const cleaned = value.replace(/\s/g, '');
      if (cleaned.length < 16) {
        return 'Số thẻ không hợp lệ';
      }
      // Simple Luhn algorithm check
      if (!isValidCardNumber(cleaned)) {
        return 'Số thẻ không hợp lệ';
      }
      return '';
    },

    expiryDate: (value) => {
      if (!value) {
        return 'Ngày hết hạn là bắt buộc';
      }
      if (!/^\d{2}\/\d{2}$/.test(value)) {
        return 'Ngày hết hạn không hợp lệ (MM/YY)';
      }
      
      const [month, year] = value.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      const expMonth = parseInt(month);
      const expYear = parseInt(year);
      
      if (expMonth < 1 || expMonth > 12) {
        return 'Tháng không hợp lệ';
      }
      
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return 'Thẻ đã hết hạn';
      }
      
      return '';
    },

    cvv: (value) => {
      if (!value) {
        return 'Mã CVV là bắt buộc';
      }
      if (value.length < 3 || value.length > 4) {
        return 'Mã CVV không hợp lệ (3-4 chữ số)';
      }
      return '';
    },

    cardName: (value) => {
      if (!value || value.trim().length < 2) {
        return 'Tên chủ thẻ không hợp lệ';
      }
      return '';
    }
  };

  // Luhn algorithm for credit card validation
  const isValidCardNumber = (cardNumber) => {
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cardNumber.charAt(i));
      
      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }
      
      sum += n;
      alternate = !alternate;
    }
    
    return (sum % 10) === 0;
  };

  // Validate a single field
  const validateField = useCallback((fieldName, value) => {
    const rule = validationRules[fieldName];
    if (rule) {
      const error = rule(value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      return error;
    }
    return '';
  }, []);

  // Validate multiple fields
  const validateFields = useCallback((fieldsData) => {
    const newErrors = {};
    let isValid = true;

    Object.entries(fieldsData).forEach(([fieldName, value]) => {
      const error = validationRules[fieldName] ? validationRules[fieldName](value) : '';
      newErrors[fieldName] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  }, []);

  // Mark field as touched
  const markFieldTouched = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  // Mark multiple fields as touched
  const markFieldsTouched = useCallback((fieldNames) => {
    const newTouched = fieldNames.reduce((acc, fieldName) => {
      acc[fieldName] = true;
      return acc;
    }, {});
    setTouched(prev => ({ ...prev, ...newTouched }));
  }, []);

  // Clear errors for a field
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  // Check if form section is valid
  const isSectionValid = useCallback((sectionFields, data) => {
    return sectionFields.every(field => {
      const error = validationRules[field] ? validationRules[field](data[field]) : '';
      return !error;
    });
  }, []);

  // Validate shipping form
  const validateShippingForm = useCallback((shippingData) => {
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'district', 'ward'];
    const fieldsData = {};
    
    requiredFields.forEach(field => {
      fieldsData[field] = shippingData[field];
    });

    return validateFields(fieldsData);
  }, [validateFields]);

  // Validate payment form
  const validatePaymentForm = useCallback((paymentData) => {
    const fieldsData = { paymentMethod: paymentData.method };

    // Additional validation for credit card
    if (paymentData.method === 'credit-card') {
      fieldsData.cardNumber = paymentData.cardNumber;
      fieldsData.expiryDate = paymentData.expiryDate;
      fieldsData.cvv = paymentData.cvv;
      fieldsData.cardName = paymentData.cardName;
    }

    return validateFields(fieldsData);
  }, [validateFields]);

  // Get error message for a field
  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  }, [errors, touched]);

  // Check if field has error
  const hasFieldError = useCallback((fieldName) => {
    return touched[fieldName] && !!errors[fieldName];
  }, [errors, touched]);

  return {
    errors,
    touched,
    validateField,
    validateFields,
    markFieldTouched,
    markFieldsTouched,
    clearFieldError,
    clearAllErrors,
    isSectionValid,
    validateShippingForm,
    validatePaymentForm,
    getFieldError,
    hasFieldError
  };
};

export default useValidation;
