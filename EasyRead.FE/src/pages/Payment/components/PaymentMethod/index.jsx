import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Alert,
  Divider
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PaymentIcon from "@mui/icons-material/Payment";
import CreditCardForm from "./CreditCardForm";
import BankTransferInfo from "./BankTransferInfo";

const PaymentMethod = ({ paymentData, onNext, onBack, onUpdatePayment }) => {
  const [selectedMethod, setSelectedMethod] = useState(paymentData.method || "");
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    {
      id: "credit-card",
      name: "Thẻ tín dụng/Ghi nợ",
      description: "Visa, Mastercard, JCB",
      icon: <CreditCardIcon />,
      popular: true
    },
    {
      id: "bank-transfer",
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản qua Internet Banking",
      icon: <AccountBalanceIcon />,
      popular: false
    },
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán bằng tiền mặt khi nhận hàng",
      icon: <LocalAtmIcon />,
      popular: true
    },
    {
      id: "digital-wallet",
      name: "Ví điện tử",
      description: "MoMo, ZaloPay, VNPay",
      icon: <PaymentIcon />,
      popular: false
    }
  ];

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    onUpdatePayment({ method });
    setErrors({}); // Clear errors when changing method
  };

  const validatePayment = () => {
    const newErrors = {};

    if (!selectedMethod) {
      newErrors.method = "Vui lòng chọn phương thức thanh toán";
      setErrors(newErrors);
      return false;
    }

    // Validate credit card if selected
    if (selectedMethod === "credit-card") {
      const { cardNumber, expiryDate, cvv, cardName } = paymentData;
      
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = "Số thẻ không hợp lệ";
      }
      
      if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = "Ngày hết hạn không hợp lệ (MM/YY)";
      }
      
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = "Mã CVV không hợp lệ";
      }
      
      if (!cardName || cardName.trim().length < 2) {
        newErrors.cardName = "Tên chủ thẻ không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePayment()) {
      onNext();
    }
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case "credit-card":
        return (
          <CreditCardForm
            paymentData={paymentData}
            onUpdatePayment={onUpdatePayment}
            errors={errors}
          />
        );
      case "bank-transfer":
        return <BankTransferInfo />;
      case "cod":
        return (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body1" fontWeight="medium">
              Thanh toán khi nhận hàng
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              • Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng<br/>
              • Phí COD: Miễn phí<br/>
              • Vui lòng chuẩn bị đúng số tiền để thuận tiện cho việc giao nhận
            </Typography>
          </Alert>
        );
      case "digital-wallet":
        return (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body1" fontWeight="medium">
              Ví điện tử
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Bạn sẽ được chuyển hướng đến ứng dụng ví điện tử để hoàn tất thanh toán.
              Các ví điện tử được hỗ trợ: MoMo, ZaloPay, VNPay.
            </Typography>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h2" component="h2" gutterBottom>
        Phương thức thanh toán
      </Typography>

      <Grid container spacing={3}>
        {/* Payment Methods */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chọn phương thức thanh toán
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedMethod}
                onChange={(e) => handleMethodChange(e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <Paper
                    key={method.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: '1px solid #e0e0e0',
                      borderColor: selectedMethod === method.id ? 'primary.main' : '#e0e0e0',
                      backgroundColor: selectedMethod === method.id ? 'primary.50' : 'transparent',
                      position: 'relative'
                    }}
                  >
                    {method.popular && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: 16,
                          backgroundColor: 'success.main',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Phổ biến
                      </Box>
                    )}
                    
                    <FormControlLabel
                      value={method.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Box sx={{ color: 'primary.main', fontSize: '2rem' }}>
                            {method.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" fontWeight="medium">
                              {method.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {method.description}
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

            {errors.method && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.method}
              </Alert>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Payment Form */}
            {renderPaymentForm()}
          </Paper>
        </Grid>

        {/* Security Info */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bảo mật thanh toán
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                🔒 Thanh toán an toàn
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thông tin thanh toán của bạn được mã hóa với công nghệ SSL 256-bit
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                🛡️ Bảo vệ thông tin
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chúng tôi không lưu trữ thông tin thẻ tín dụng của bạn
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                💳 Thẻ được hỗ trợ
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <img src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png" alt="Visa" height="24" />
                <img src="https://logos-world.net/wp-content/uploads/2020/04/Mastercard-Logo.png" alt="Mastercard" height="24" />
                <img src="https://logos-world.net/wp-content/uploads/2020/04/JCB-Logo.png" alt="JCB" height="24" />
              </Box>
            </Box>

            <Box>
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                📞 Hỗ trợ 24/7
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Liên hệ: 1900-1234 nếu bạn cần hỗ trợ
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          size="large"
        >
          Quay lại thông tin giao hàng
        </Button>
        
        <Button
          variant="contained"
          onClick={handleNext}
          size="large"
          disabled={!selectedMethod}
          sx={{ minWidth: 200 }}
        >
          Xem lại đơn hàng
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentMethod;
