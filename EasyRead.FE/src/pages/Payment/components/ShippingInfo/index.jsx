import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Alert
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlashOnIcon from "@mui/icons-material/FlashOn";

const ShippingInfo = ({ shippingData, onNext, onBack, onUpdateShipping }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Vietnam cities/provinces (simplified list)
  const cities = [
    "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông"
  ];

  const deliveryOptions = [
    {
      id: "standard",
      name: "Giao hàng tiêu chuẩn",
      description: "3-5 ngày làm việc",
      price: 30000,
      icon: <LocalShippingIcon />
    },
    {
      id: "express",
      name: "Giao hàng nhanh",
      description: "1-2 ngày làm việc",
      price: 50000,
      icon: <AccessTimeIcon />
    },
    {
      id: "same-day",
      name: "Giao hàng trong ngày",
      description: "Trong vòng 6 giờ (chỉ HN, HCM)",
      price: 80000,
      icon: <FlashOnIcon />
    }
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.trim().length < 2 ? 'Họ tên phải có ít nhất 2 ký tự' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Email không hợp lệ' : '';
      case 'phone':
        const phoneRegex = /^[0-9]{10,11}$/;
        return !phoneRegex.test(value.replace(/\s/g, '')) ? 'Số điện thoại không hợp lệ' : '';
      case 'address':
        return value.trim().length < 10 ? 'Địa chỉ phải có ít nhất 10 ký tự' : '';
      case 'city':
        return !value ? 'Vui lòng chọn tỉnh/thành phố' : '';
      case 'district':
        return value.trim().length < 2 ? 'Vui lòng nhập quận/huyện' : '';
      case 'ward':
        return value.trim().length < 2 ? 'Vui lòng nhập phường/xã' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (field, value) => {
    onUpdateShipping({ [field]: value });
    
    // Validate on change if field was previously touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, shippingData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleDeliveryOptionChange = (optionId) => {
    const option = deliveryOptions.find(opt => opt.id === optionId);
    onUpdateShipping({ 
      deliveryOption: optionId,
      deliveryPrice: option.price 
    });
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'district', 'ward'];
    const newErrors = {};
    let isValid = true;

    requiredFields.forEach(field => {
      const error = validateField(field, shippingData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const isFormValid = Object.values(errors).every(error => !error) && 
                     ['fullName', 'email', 'phone', 'address', 'city', 'district', 'ward']
                       .every(field => shippingData[field]?.trim());

  return (
    <Box>
      <Typography variant="h2" component="h2" gutterBottom>
        Thông tin giao hàng
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Shipping Address Form */}
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Địa chỉ nhận hàng
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Full Name */}
            <TextField
              fullWidth
              label="Họ và tên *"
              value={shippingData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              error={!!errors.fullName}
              helperText={errors.fullName}
              placeholder="Nguyễn Văn A"
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={shippingData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="example@email.com"
            />

            {/* Phone */}
            <TextField
              fullWidth
              label="Số điện thoại *"
              value={shippingData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="0123456789"
            />

            {/* City */}
            <FormControl fullWidth error={!!errors.city}>
              <InputLabel>Tỉnh/Thành phố *</InputLabel>
              <Select
                value={shippingData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                label="Tỉnh/Thành phố *"
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
              {errors.city && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.city}
                </Typography>
              )}
            </FormControl>

            {/* District */}
            <TextField
              fullWidth
              label="Quận/Huyện *"
              value={shippingData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              onBlur={() => handleBlur('district')}
              error={!!errors.district}
              helperText={errors.district}
              placeholder="Quận 1"
            />

            {/* Ward */}
            <TextField
              fullWidth
              label="Phường/Xã *"
              value={shippingData.ward}
              onChange={(e) => handleInputChange('ward', e.target.value)}
              onBlur={() => handleBlur('ward')}
              error={!!errors.ward}
              helperText={errors.ward}
              placeholder="Phường Bến Nghé"
            />

            {/* Address */}
            <TextField
              fullWidth
              label="Địa chỉ chi tiết *"
              multiline
              rows={2}
              value={shippingData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              error={!!errors.address}
              helperText={errors.address}
              placeholder="Số nhà, tên đường..."
            />

            {/* Notes */}
            <TextField
              fullWidth
              label="Ghi chú (không bắt buộc)"
              multiline
              rows={2}
              value={shippingData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ghi chú cho người giao hàng..."
            />
          </Box>
        </Paper>

        {/* Delivery Options */}
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Phương thức giao hàng
          </Typography>

          <FormControl component="fieldset">
            <RadioGroup
              value={shippingData.deliveryOption}
              onChange={(e) => handleDeliveryOptionChange(e.target.value)}
            >
              {deliveryOptions.map((option) => (
                <Paper
                  key={option.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: '1px solid #e0e0e0',
                    borderColor: shippingData.deliveryOption === option.id ? 'primary.main' : '#e0e0e0',
                    backgroundColor: shippingData.deliveryOption === option.id ? 'primary.50' : 'transparent'
                  }}
                >
                  <FormControlLabel
                    value={option.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        {option.icon}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {option.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.description}
                          </Typography>
                          <Typography variant="body1" color="primary" fontWeight="bold">
                            {formatPrice(option.price)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ margin: 0, width: '100%' }}
                  />
                </Paper>
              ))}
            </RadioGroup>
          </FormControl>

          {/* Special delivery note */}
          {shippingData.deliveryOption === 'same-day' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Giao hàng trong ngày chỉ áp dụng cho khu vực nội thành Hà Nội và TP.HCM
            </Alert>
          )}
        </Paper>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          size="large"
        >
          Quay lại giỏ hàng
        </Button>
        
        <Button
          variant="contained"
          onClick={handleNext}
          size="large"
          disabled={!isFormValid}
          sx={{ minWidth: 200 }}
        >
          Tiếp tục thanh toán
        </Button>
      </Box>
    </Box>
  );
};

export default ShippingInfo;
