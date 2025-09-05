import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Paper,
  Divider,
  Alert
} from "@mui/material";
import ProductItem from "./ProductItem";
import PriceSummary from "./PriceSummary";

const CartReview = ({ cartData, onNext, onUpdateCart }) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = () => {
    // Simple coupon validation
    const validCoupons = {
      "SAVE10": { discount: 0.1, type: "percentage", description: "Giảm 10%" },
      "FREESHIP": { discount: 30000, type: "fixed", description: "Miễn phí vận chuyển" },
      "NEWUSER": { discount: 50000, type: "fixed", description: "Giảm 50.000đ cho khách hàng mới" }
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      const coupon = validCoupons[couponCode.toUpperCase()];
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      setCouponError("");
      
      // Calculate new totals
      let newDiscount = 0;
      let newShipping = cartData.shipping;
      
      if (coupon.type === "percentage") {
        newDiscount = cartData.subtotal * coupon.discount;
      } else {
        if (couponCode.toUpperCase() === "FREESHIP") {
          newShipping = 0;
          newDiscount = cartData.shipping;
        } else {
          newDiscount = coupon.discount;
        }
      }
      
      const newTotal = cartData.subtotal + newShipping + cartData.tax - newDiscount;
      
      onUpdateCart({
        ...cartData,
        shipping: newShipping,
        discount: newDiscount,
        total: newTotal,
        coupon: { code: couponCode.toUpperCase(), ...coupon }
      });
    } else {
      setCouponError("Mã giảm giá không hợp lệ");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    
    // Reset totals
    const newTotal = cartData.subtotal + 30000 + cartData.tax; // Reset shipping to 30000
    onUpdateCart({
      ...cartData,
      shipping: 30000,
      discount: 0,
      total: newTotal,
      coupon: null
    });
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartData.items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newTotal = newSubtotal + cartData.shipping + cartData.tax - cartData.discount;
    
    onUpdateCart({
      ...cartData,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newTotal
    });
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = cartData.items.filter(item => item.id !== itemId);
    const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newTotal = newSubtotal + cartData.shipping + cartData.tax - cartData.discount;
    
    onUpdateCart({
      ...cartData,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newTotal
    });
  };

  return (
    <Box>
      <Typography variant="h2" component="h2" gutterBottom>
        Xem lại giỏ hàng
      </Typography>
      
      <Grid container spacing={3}>
        {/* Product List */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm trong giỏ hàng ({cartData.items.length})
            </Typography>
            
            {cartData.items.map((item) => (
              <ProductItem
                key={item.id}
                item={item}
                onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            {/* Coupon Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Mã giảm giá
              </Typography>
              
              {appliedCoupon ? (
                <Alert 
                  severity="success" 
                  onClose={handleRemoveCoupon}
                  sx={{ mb: 2 }}
                >
                  Mã "{appliedCoupon.code}" đã được áp dụng - {appliedCoupon.description}
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    error={!!couponError}
                    helperText={couponError}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Áp dụng
                  </Button>
                </Box>
              )}
              
              <Typography variant="body2" color="text.secondary">
                Mã giảm giá có sẵn: SAVE10, FREESHIP, NEWUSER
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Price Summary */}
        <Grid item xs={12} md={4}>
          <PriceSummary 
            cartData={cartData}
            onNext={onNext}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartReview;
