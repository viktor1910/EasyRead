import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Tooltip,
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext/CartContext";

const CartIcon = () => {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const [updating, setUpdating] = useState({});
  const navigate = useNavigate();

  // Debug logging
  console.log("CartIcon - cart:", cart);
  console.log("CartIcon - loading:", loading);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 0) return;

    setUpdating((prev) => ({ ...prev, [itemId]: true }));
    await updateQuantity(itemId, newQuantity);
    setUpdating((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleRemoveItem = async (itemId) => {
    setUpdating((prev) => ({ ...prev, [itemId]: true }));
    await removeItem(itemId);
    setUpdating((prev) => ({ ...prev, [itemId]: false }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Giỏ hàng">
        <IconButton color="inherit" onClick={handleClick} disabled={loading}>
          <Badge badgeContent={cart?.items_count || 0} color="error" max={99}>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Cart Dropdown */}
      <Paper
        sx={{
          position: "absolute",
          top: 60,
          right: 20,
          width: 350,
          maxHeight: 500,
          overflow: "auto",
          zIndex: 1300,
          display: open ? "block" : "none",
        }}
        elevation={8}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Giỏ hàng
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} />
            </Box>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
            <Box textAlign="center" py={3}>
              <Typography variant="body2" color="text.secondary">
                Giỏ hàng trống
              </Typography>
            </Box>
          ) : (
            <>
              {/* Danh sách sản phẩm */}
              <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                {cart.items.map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Box display="flex" gap={2}>
                      <Box
                        component="img"
                        src={
                          item.motopart?.image_full_url ||
                          "/placeholder-motopart.jpg"
                        }
                        alt={item.motopart?.name}
                        sx={{
                          width: 50,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />

                      <Box flex={1}>
                        <Typography variant="subtitle2" gutterBottom>
                          {item.motopart?.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="primary"
                          gutterBottom
                        >
                          {formatPrice(item.unit_price)}
                        </Typography>

                        <Box display="flex" alignItems="center" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={updating[item.id] || item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>

                          <Typography
                            variant="body2"
                            sx={{ minWidth: 20, textAlign: "center" }}
                          >
                            {item.quantity}
                          </Typography>

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updating[item.id]}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={updating[item.id]}
                            sx={{ ml: "auto" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                ))}
              </Box>

              {/* Tổng tiền */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">Tổng cộng:</Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(cart.subtotal)}
                  </Typography>
                </Box>
              </Box>

              {/* Nút hành động */}
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => {
                    handleClose();
                    navigate("/cart");
                  }}
                >
                  Xem giỏ hàng
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => {
                    handleClose();
                    navigate("/cart");
                  }}
                >
                  Thanh toán
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default CartIcon;
