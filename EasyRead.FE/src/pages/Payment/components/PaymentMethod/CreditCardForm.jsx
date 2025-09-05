import React from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Tooltip
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const CreditCardForm = ({ paymentData, onUpdatePayment, errors }) => {
  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      onUpdatePayment({ cardNumber: formatted });
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      onUpdatePayment({ expiryDate: formatted });
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      onUpdatePayment({ cvv: value });
    }
  };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('35')) return 'JCB';
    return '';
  };

  const cardType = getCardType(paymentData.cardNumber || '');

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CreditCardIcon />
        Thông tin thẻ tín dụng/ghi nợ
      </Typography>

      <Grid container spacing={3}>
        {/* Card Number */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Số thẻ *"
            value={paymentData.cardNumber || ''}
            onChange={handleCardNumberChange}
            error={!!errors.cardNumber}
            helperText={errors.cardNumber || (cardType && `Loại thẻ: ${cardType}`)}
            placeholder="1234 5678 9012 3456"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon color="action" />
                </InputAdornment>
              ),
            }}
            inputProps={{
              maxLength: 19 // 16 digits + 3 spaces
            }}
          />
        </Grid>

        {/* Cardholder Name */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tên chủ thẻ *"
            value={paymentData.cardName || ''}
            onChange={(e) => onUpdatePayment({ cardName: e.target.value.toUpperCase() })}
            error={!!errors.cardName}
            helperText={errors.cardName || 'Tên như trên thẻ (viết hoa)'}
            placeholder="NGUYEN VAN A"
            inputProps={{
              style: { textTransform: 'uppercase' }
            }}
          />
        </Grid>

        {/* Expiry Date */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Ngày hết hạn *"
            value={paymentData.expiryDate || ''}
            onChange={handleExpiryChange}
            error={!!errors.expiryDate}
            helperText={errors.expiryDate || 'MM/YY'}
            placeholder="12/25"
            inputProps={{
              maxLength: 5
            }}
          />
        </Grid>

        {/* CVV */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mã CVV *"
            value={paymentData.cvv || ''}
            onChange={handleCvvChange}
            error={!!errors.cvv}
            helperText={errors.cvv || '3-4 số ở mặt sau thẻ'}
            placeholder="123"
            type="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Mã CVV là 3-4 số cuối ở mặt sau thẻ, gần chữ ký của bạn">
                    <IconButton edge="end" size="small">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            inputProps={{
              maxLength: 4
            }}
          />
        </Grid>
      </Grid>

      {/* Security Note */}
      <Box 
        sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: 'grey.50', 
          borderRadius: 1,
          border: '1px solid #e0e0e0'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>🔒 Bảo mật:</strong> Thông tin thẻ của bạn được mã hóa và xử lý an toàn. 
          Chúng tôi không lưu trữ thông tin thẻ tín dụng của bạn.
        </Typography>
      </Box>
    </Box>
  );
};

export default CreditCardForm;
