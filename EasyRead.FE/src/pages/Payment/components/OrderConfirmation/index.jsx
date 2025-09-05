import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OrderSummary from "./OrderSummary";
import ShippingSummary from "./ShippingSummary";
import PaymentSummary from "./PaymentSummary";

const OrderConfirmation = ({ orderData, onBack, onConfirm }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ER${timestamp.slice(-6)}${random}`;
  };

  const handleConfirmOrder = async () => {
    if (!agreedToTerms || !agreedToPolicy) {
      alert("Vui lòng đồng ý với các điều khoản và chính sách");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);
      setShowSuccessDialog(true);
      
      // Call parent confirmation handler
      onConfirm({
        orderNumber: newOrderNumber,
        orderData
      });
    } catch (error) {
      console.error("Order confirmation failed:", error);
      alert("Có lỗi xảy ra khi xác nhận đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Redirect to success page or home
    window.location.href = '/';
  };

  const canProceed = agreedToTerms && agreedToPolicy && !isProcessing;

  return (
    <Box>
      <Typography variant="h2" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Xác nhận đơn hàng
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Alert severity="info" sx={{ maxWidth: '600px', width: '100%' }}>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Vui lòng kiểm tra lại thông tin đơn hàng trước khi xác nhận. 
            Sau khi xác nhận, bạn sẽ không thể thay đổi thông tin đặt hàng.
          </Typography>
        </Alert>
      </Box>

      <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Order Details */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
            alignItems: 'center'
          }}>
            {/* Order Summary */}
            <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '800px' } }}>
              <OrderSummary cartData={orderData.cart} />
            </Box>
            
            {/* Shipping Summary */}
            <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '800px' } }}>
              <ShippingSummary shippingData={orderData.shipping} />
            </Box>
            
            {/* Payment Summary */}
            <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '800px' } }}>
              <PaymentSummary paymentData={orderData.payment} />
            </Box>
          </Box>
        </Grid>

        {/* Final Summary & Actions */}
        <Grid item xs={12} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={2} sx={{ 
            p: 3, 
            position: { xs: 'static', lg: 'sticky' }, 
            top: 20,
            width: '100%',
            maxWidth: { xs: '100%', md: '400px' },
            height: 'fit-content'
          }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              Tổng kết đơn hàng
            </Typography>

            {/* Price Breakdown */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tạm tính:</Typography>
                <Typography>{formatPrice(orderData.cart.subtotal)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Phí vận chuyển:</Typography>
                <Typography color={orderData.cart.shipping === 0 ? "success.main" : "inherit"}>
                  {orderData.cart.shipping === 0 ? "Miễn phí" : formatPrice(orderData.cart.shipping)}
                </Typography>
              </Box>
              
              {orderData.cart.discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Giảm giá:</Typography>
                  <Typography color="success.main">
                    -{formatPrice(orderData.cart.discount)}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Tổng cộng:</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatPrice(orderData.cart.total)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Terms and Conditions */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    Tôi đồng ý với{" "}
                    <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto' }}>
                      Điều khoản sử dụng
                    </Button>
                  </Typography>
                }
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    Tôi đồng ý với{" "}
                    <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto' }}>
                      Chính sách bảo mật
                    </Button>
                  </Typography>
                }
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleConfirmOrder}
                disabled={!canProceed}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {isProcessing ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Đang xử lý...
                  </Box>
                ) : (
                  "Xác nhận đặt hàng"
                )}
              </Button>
              
              <Button
                variant="outlined"
                size="medium"
                fullWidth
                onClick={onBack}
                disabled={isProcessing}
              >
                Quay lại phương thức thanh toán
              </Button>
            </Box>

            {/* Estimated Delivery */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                📦 Dự kiến giao hàng: {
                  orderData.shipping.deliveryOption === 'same-day' ? 'Trong ngày' :
                  orderData.shipping.deliveryOption === 'express' ? '1-2 ngày' : '3-5 ngày'
                } làm việc
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Success Dialog */}
      <Dialog 
        open={showSuccessDialog} 
        onClose={handleSuccessDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon 
            sx={{ 
              fontSize: '4rem', 
              color: 'success.main', 
              mb: 2 
            }} 
          />
          
          <Typography variant="h4" component="h2" gutterBottom color="success.main">
            Đặt hàng thành công!
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Cảm ơn bạn đã đặt hàng tại EasyRead
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Mã đơn hàng: <strong>{orderNumber}</strong>
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Chúng tôi đã gửi email xác nhận đến {orderData.shipping.email}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleSuccessDialogClose}
            size="large"
          >
            Về trang chủ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderConfirmation;
