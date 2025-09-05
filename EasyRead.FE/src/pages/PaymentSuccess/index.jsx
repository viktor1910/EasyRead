import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Divider,
  Avatar,
  Chip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PrintIcon from "@mui/icons-material/Print";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EmailIcon from "@mui/icons-material/Email";

const PaymentSuccessPage = () => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // In a real app, you would get order data from URL params or API
    // For demo purposes, using mock data
    const mockOrderData = {
      orderNumber: "ER123456ABC",
      date: new Date().toLocaleDateString('vi-VN'),
      email: "customer@example.com",
      total: 728000,
      items: [
        {
          id: 1,
          title: "Effective TypeScript",
          author: "Dan Vanderkam",
          price: 299000,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300"
        },
        {
          id: 2,
          title: "Clean Code",
          author: "Robert C. Martin",
          price: 399000,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300"
        }
      ],
      shipping: {
        fullName: "Nguyễn Văn A",
        address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
        deliveryOption: "standard"
      },
      paymentMethod: "credit-card"
    };

    setOrderData(mockOrderData);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePrint = () => {
    window.print();
  };

  const getDeliveryTime = (option) => {
    switch (option) {
      case "standard": return "3-5 ngày làm việc";
      case "express": return "1-2 ngày làm việc";
      case "same-day": return "Trong ngày";
      default: return "3-5 ngày làm việc";
    }
  };

  if (!orderData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Đang tải thông tin đơn hàng...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 3, md: 4 } }}>
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleIcon 
            sx={{ 
              fontSize: '5rem', 
              color: 'success.main', 
              mb: 2 
            }} 
          />
          
          <Typography variant="h1" component="h1" color="success.main" gutterBottom>
            Đặt hàng thành công!
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Cảm ơn bạn đã tin tượng và mua sắm tại EasyRead
          </Typography>
          
          <Chip 
            label={`Mã đơn hàng: ${orderData.orderNumber}`}
            color="primary"
            variant="outlined"
            sx={{ mt: 2, fontSize: '1rem', py: 3 }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Order Details */}
        <Grid container spacing={3}>
          {/* Order Summary */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Chi tiết đơn hàng
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {orderData.items.map((item) => (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <Avatar
                        src={item.image}
                        alt={item.title}
                        variant="rounded"
                        sx={{ width: 60, height: 60, mx: 'auto' }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={7}>
                      <Typography variant="body1" fontWeight="medium">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.author}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {formatPrice(item.price)} × {item.quantity}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary">
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>

            {/* Shipping Info */}
            <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                📦 Thông tin giao hàng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Người nhận:</strong> {orderData.shipping.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Địa chỉ:</strong> {orderData.shipping.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Thời gian giao hàng:</strong> {getDeliveryTime(orderData.shipping.deliveryOption)}
              </Typography>
            </Paper>
          </Grid>

          {/* Order Info */}
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin đơn hàng
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Ngày đặt hàng
                </Typography>
                <Typography variant="body1">
                  {orderData.date}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tổng tiền
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(orderData.total)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body1">
                  {orderData.paymentMethod === 'credit-card' ? 'Thẻ tín dụng' :
                   orderData.paymentMethod === 'bank-transfer' ? 'Chuyển khoản' :
                   orderData.paymentMethod === 'cod' ? 'COD' : 'Ví điện tử'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<HomeIcon />}
                  fullWidth
                  onClick={() => window.location.href = '/'}
                >
                  Về trang chủ
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ShoppingCartIcon />}
                  fullWidth
                  onClick={() => window.location.href = '/'}
                >
                  Tiếp tục mua sắm
                </Button>
                
                <Button
                  variant="text"
                  startIcon={<PrintIcon />}
                  fullWidth
                  onClick={handlePrint}
                >
                  In đơn hàng
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Additional Info */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <EmailIcon color="primary" />
            Email xác nhận đã được gửi đến {orderData.email}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ:<br/>
            📞 Hotline: 1900-1234<br/>
            📧 Email: support@easyread.com<br/>
            🕒 Thời gian hỗ trợ: 8:00 - 22:00 (Tất cả các ngày trong tuần)
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccessPage;
