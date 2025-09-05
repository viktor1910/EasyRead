import React from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductItem = ({ item, onQuantityChange, onRemove }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    onQuantityChange(item.quantity + 1);
  };

  const handleQuantityInput = (event) => {
    const value = parseInt(event.target.value) || 1;
    if (value > 0) {
      onQuantityChange(value);
    }
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        mb: 2, 
        border: '1px solid #e0e0e0',
        '&:hover': {
          boxShadow: 1
        }
      }}
    >
      <Grid container spacing={2} sx={{ p: 2 }}>
        {/* Product Image */}
        <Grid item xs={12} sm={3}>
          <CardMedia
            component="img"
            image={item.image}
            alt={item.title}
            sx={{
              height: { xs: 150, sm: 120 },
              objectFit: 'cover',
              borderRadius: 1
            }}
          />
        </Grid>
        
        {/* Product Info */}
        <Grid item xs={12} sm={5}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Tác giả: {item.author}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
              {formatPrice(item.price)}
            </Typography>
          </CardContent>
        </Grid>
        
        {/* Quantity Controls */}
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Số lượng
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={handleQuantityDecrease}
                disabled={item.quantity <= 1}
                sx={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: 1
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              
              <TextField
                size="small"
                value={item.quantity}
                onChange={handleQuantityInput}
                inputProps={{
                  style: { textAlign: 'center', width: '40px' },
                  min: 1
                }}
                type="number"
                variant="outlined"
              />
              
              <IconButton 
                size="small" 
                onClick={handleQuantityIncrease}
                sx={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: 1
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        
        {/* Total Price & Remove */}
        <Grid item xs={12} sm={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" color="primary">
              {formatPrice(item.price * item.quantity)}
            </Typography>
            
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onRemove}
              sx={{ minWidth: 'auto', p: 1 }}
            >
              Xóa
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ProductItem;
