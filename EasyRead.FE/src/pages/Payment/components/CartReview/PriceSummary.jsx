import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DiscountIcon from "@mui/icons-material/Discount";

const PriceSummary = ({ cartData, onNext }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShoppingCartIcon color="primary" />
        Tóm tắt đơn hàng
      </Typography>
      
      <List disablePadding>
        {/* Subtotal */}
        <ListItem disableGutters sx={{ py: 1 }}>
          <ListItemText 
            primary={`Tạm tính (${totalItems} sản phẩm)`}
            primaryTypographyProps={{ variant: 'body1' }}
          />
          <Typography variant="body1">
            {formatPrice(cartData.subtotal)}
          </Typography>
        </ListItem>
        
        {/* Shipping */}
        <ListItem disableGutters sx={{ py: 1 }}>
          <ListItemText 
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShippingIcon fontSize="small" color="action" />
                Phí vận chuyển
              </Box>
            }
            primaryTypographyProps={{ variant: 'body1' }}
          />
          <Typography variant="body1" color={cartData.shipping === 0 ? "success.main" : "inherit"}>
            {cartData.shipping === 0 ? "Miễn phí" : formatPrice(cartData.shipping)}
          </Typography>
        </ListItem>
        
        {/* Tax */}
        {cartData.tax > 0 && (
          <ListItem disableGutters sx={{ py: 1 }}>
            <ListItemText 
              primary="Thuế VAT"
              primaryTypographyProps={{ variant: 'body1' }}
            />
            <Typography variant="body1">
              {formatPrice(cartData.tax)}
            </Typography>
          </ListItem>
        )}
        
        {/* Discount */}
        {cartData.discount > 0 && (
          <ListItem disableGutters sx={{ py: 1 }}>
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DiscountIcon fontSize="small" color="success" />
                  Giảm giá
                  {cartData.coupon && (
                    <Chip 
                      label={cartData.coupon.code} 
                      size="small" 
                      color="success" 
                      variant="outlined"
                    />
                  )}
                </Box>
              }
              primaryTypographyProps={{ variant: 'body1' }}
            />
            <Typography variant="body1" color="success.main">
              -{formatPrice(cartData.discount)}
            </Typography>
          </ListItem>
        )}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="span">
          Tổng cộng
        </Typography>
        <Typography variant="h5" component="span" color="primary" fontWeight="bold">
          {formatPrice(cartData.total)}
        </Typography>
      </Box>
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onNext}
          disabled={cartData.items.length === 0}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600
          }}
        >
          Tiếp tục thanh toán
        </Button>
        
        <Button
          variant="outlined"
          size="medium"
          fullWidth
          onClick={() => window.history.back()}
        >
          Tiếp tục mua sắm
        </Button>
      </Box>
      
      {/* Security Info */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          🔒 Thanh toán an toàn với mã hóa SSL
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 0.5 }}>
          Chúng tôi không lưu trữ thông tin thẻ của bạn
        </Typography>
      </Box>
    </Paper>
  );
};

export default PriceSummary;
