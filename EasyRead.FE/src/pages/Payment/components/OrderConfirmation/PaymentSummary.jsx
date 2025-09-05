import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

const PaymentSummary = ({ paymentData }) => {
  const getPaymentMethodInfo = (method) => {
    switch (method) {
      case "credit-card":
        return {
          name: "Thẻ tín dụng/Ghi nợ",
          icon: <CreditCardIcon />,
          description: "Thanh toán bằng thẻ"
        };
      case "bank-transfer":
        return {
          name: "Chuyển khoản ngân hàng",
          icon: <AccountBalanceIcon />,
          description: "Chuyển khoản qua Internet Banking"
        };
      case "cod":
        return {
          name: "Thanh toán khi nhận hàng",
          icon: <LocalAtmIcon />,
          description: "Thanh toán bằng tiền mặt"
        };
      case "digital-wallet":
        return {
          name: "Ví điện tử",
          icon: <PaymentIcon />,
          description: "MoMo, ZaloPay, VNPay"
        };
      default:
        return {
          name: "Chưa chọn",
          icon: <PaymentIcon />,
          description: ""
        };
    }
  };

  const paymentInfo = getPaymentMethodInfo(paymentData.method);

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return "";
    const cleaned = cardNumber.replace(/\s/g, '');
    const masked = cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '**** **** **** $4');
    return masked;
  };

  const getCardType = (cardNumber) => {
    if (!cardNumber) return "";
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('35')) return 'JCB';
    return '';
  };

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PaymentIcon color="primary" />
        Phương thức thanh toán
      </Typography>

      <Grid container spacing={3}>
        {/* Payment Method */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'primary.main',
              backgroundColor: 'primary.50'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{ color: 'primary.main' }}>
                {paymentInfo.icon}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" fontWeight="medium" color="primary">
                  {paymentInfo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {paymentInfo.description}
                </Typography>
              </Box>
              <Chip
                label="Đã chọn"
                color="primary"
                size="small"
              />
            </Box>

            {/* Credit Card Details */}
            {paymentData.method === "credit-card" && paymentData.cardNumber && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Thông tin thẻ
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="body1" fontFamily="monospace">
                    {maskCardNumber(paymentData.cardNumber)}
                  </Typography>
                  {getCardType(paymentData.cardNumber) && (
                    <Chip 
                      label={getCardType(paymentData.cardNumber)}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {paymentData.cardName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Hết hạn: {paymentData.expiryDate}
                </Typography>
              </Box>
            )}

            {/* Bank Transfer Info */}
            {paymentData.method === "bank-transfer" && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'warning.50', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
                <Typography variant="body2" color="warning.dark" fontWeight="medium">
                  ⚠️ Lưu ý quan trọng
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Vui lòng chuyển khoản trong vòng 24 giờ để giữ đơn hàng.
                  Thông tin chuyển khoản chi tiết sẽ được gửi qua email.
                </Typography>
              </Box>
            )}

            {/* COD Info */}
            {paymentData.method === "cod" && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.main' }}>
                <Typography variant="body2" color="info.dark" fontWeight="medium">
                  💡 Thanh toán khi nhận hàng
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Vui lòng chuẩn bị đúng số tiền để thuận tiện cho việc giao nhận.
                  Phí COD: Miễn phí.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PaymentSummary;
