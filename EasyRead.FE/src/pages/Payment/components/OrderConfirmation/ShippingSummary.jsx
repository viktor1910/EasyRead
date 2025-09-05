import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const ShippingSummary = ({ shippingData }) => {
  const getDeliveryOptionInfo = (option) => {
    switch (option) {
      case "standard":
        return { name: "Giao hàng tiêu chuẩn", time: "3-5 ngày làm việc" };
      case "express":
        return { name: "Giao hàng nhanh", time: "1-2 ngày làm việc" };
      case "same-day":
        return { name: "Giao hàng trong ngày", time: "Trong vòng 6 giờ" };
      default:
        return { name: "Giao hàng tiêu chuẩn", time: "3-5 ngày làm việc" };
    }
  };

  const deliveryInfo = getDeliveryOptionInfo(shippingData.deliveryOption);

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalShippingIcon color="primary" />
        Thông tin giao hàng
      </Typography>

      <Grid container spacing={3}>
        {/* Delivery Address */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" fontWeight="medium" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon fontSize="small" color="action" />
              Địa chỉ nhận hàng
            </Typography>
            
            <Box sx={{ ml: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PersonIcon fontSize="small" />
                {shippingData.fullName}
              </Typography>
              
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PhoneIcon fontSize="small" />
                {shippingData.phone}
              </Typography>
              
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmailIcon fontSize="small" />
                {shippingData.email}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {shippingData.address}<br/>
                {shippingData.ward}, {shippingData.district}<br/>
                {shippingData.city}
              </Typography>
              
              {shippingData.notes && (
                <Box sx={{ mt: 2, p: 1, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Ghi chú:</strong> {shippingData.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Delivery Method */}
        <Grid item xs={12} md={4}>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            Phương thức giao hàng
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'primary.main',
              backgroundColor: 'primary.50'
            }}
          >
            <Typography variant="body1" fontWeight="medium" color="primary">
              {deliveryInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {deliveryInfo.time}
            </Typography>
            
            <Chip
              label="Đã chọn"
              color="primary"
              size="small"
              sx={{ mt: 1 }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ShippingSummary;
