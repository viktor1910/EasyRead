import React, { useState } from "react";
import {
  Button,
  Card,
  Chip,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useParams, useNavigate } from "react-router";
import { useGetMotopartDetail } from "./hook";
import { useCart } from "../../context/CartContext/CartContext";

const MotopartDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: motopart, isLoading, error } = useGetMotopartDetail(id);
  const { addToCart, checkout } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [buyNowDialog, setBuyNowDialog] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: "",
    payment_method: "cod",
  });

  const handleQuantityChange = (val) => {
    if (val < 1) setQuantity(1);
    else if (val > 99) setQuantity(99);
    else setQuantity(val);
  };

  const handleAddToCart = async () => {
    if (!motopart || quantity <= 0) return;

    setLoading(true);
    const result = await addToCart(motopart.id, quantity);
    setLoading(false);

    if (result.success) {
      setSnackbar({
        open: true,
        message: `Đã thêm ${quantity} sản phẩm vào giỏ hàng`,
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: result.message || "Có lỗi xảy ra khi thêm vào giỏ hàng",
        severity: "error",
      });
    }
  };

  const handleBuyNow = async () => {
    if (!motopart || quantity <= 0) return;

    setLoading(true);
    try {
      // First add to cart
      const addResult = await addToCart(motopart.id, quantity);

      if (addResult.success) {
        setBuyNowDialog(true);
      } else {
        setSnackbar({
          open: true,
          message: addResult.message || "Có lỗi xảy ra",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Buy now error:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi mua hàng",
        severity: "error",
      });
    }
    setLoading(false);
  };

  const handleConfirmBuyNow = async () => {
    setLoading(true);
    try {
      const result = await checkout(formData);
      if (result.success) {
        setSnackbar({
          open: true,
          message: "Đặt hàng thành công!",
          severity: "success",
        });
        setBuyNowDialog(false);
        navigate("/orders");
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Có lỗi xảy ra khi đặt hàng",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi đặt hàng",
        severity: "error",
      });
    }
    setLoading(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Có lỗi xảy ra khi tải thông tin phụ tùng: {error.message}
      </Alert>
    );
  }

  // No motopart found
  if (!motopart) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Không tìm thấy thông tin phụ tùng
      </Alert>
    );
  }

  const finalPrice = motopart.discount
    ? motopart.price - (motopart.price * motopart.discount) / 100
    : motopart.price;

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
      <Grid container spacing={3}>
        {/* Left: Motopart Image */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 2 }}>
            <img
              src={motopart.image_url || "/placeholder-motopart.jpg"}
              alt={motopart.name}
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          </Card>
        </Grid>

        {/* Middle: Motopart Info */}
        <Grid item xs={12} md={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {motopart.name}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Nhà cung cấp:
            </Typography>
            <Typography variant="body1">
              {motopart.supplier || "Chưa cập nhật"}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Năm sản xuất:
            </Typography>
            <Typography variant="body1">{motopart.manufacture_year}</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Danh mục:
            </Typography>
            <Typography variant="body1">
              {motopart.category?.name || "Chưa phân loại"}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Chip
              label={motopart.stock > 0 ? "Còn hàng" : "Hết hàng"}
              color={motopart.stock > 0 ? "success" : "error"}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            {motopart.discount && (
              <Typography
                variant="h6"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                {motopart.price.toLocaleString("vi-VN")}đ
              </Typography>
            )}
            <Typography variant="h5" color="primary" fontWeight="bold">
              {finalPrice.toLocaleString("vi-VN")}đ
            </Typography>
            {motopart.discount && (
              <Chip
                label={`-${motopart.discount}%`}
                color="error"
                size="small"
              />
            )}
          </Box>
        </Grid>

        {/* Right: Purchase Actions */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Mua ngay
            </Typography>

            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
              gutterBottom
            >
              {finalPrice.toLocaleString("vi-VN")}đ
            </Typography>

            {/* Quantity Selector */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Số lượng:
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                inputProps={{ min: 1, max: 99 }}
                size="small"
                sx={{ width: 80 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(quantity - 1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Buy Now Button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mb: 1 }}
              startIcon={<CreditCardOutlinedIcon />}
              onClick={handleBuyNow}
              disabled={motopart.stock <= 0 || loading}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : motopart.stock <= 0 ? (
                "Hết hàng"
              ) : (
                "Mua ngay"
              )}
            </Button>

            {/* Add to Cart Button */}
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<ShoppingCartOutlinedIcon />}
              onClick={handleAddToCart}
              disabled={motopart.stock <= 0 || loading}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : motopart.stock <= 0 ? (
                "Hết hàng"
              ) : (
                "Thêm vào giỏ"
              )}
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, textAlign: "center" }}
            >
              Nhà bán: <b>MotoShop Hà Nội</b>
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Motopart Description */}
      {motopart.description && (
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mô tả sản phẩm
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {motopart.description}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Buy Now Dialog */}
      <Dialog
        open={buyNowDialog}
        onClose={() => setBuyNowDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Mua ngay - {motopart?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Địa chí giao hàng"
              fullWidth
              multiline
              rows={3}
              value={formData.shipping_address}
              onChange={(e) =>
                setFormData({ ...formData, shipping_address: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Phương thức thanh toán"
              fullWidth
              value={formData.payment_method}
              onChange={(e) =>
                setFormData({ ...formData, payment_method: e.target.value })
              }
              SelectProps={{ native: true }}
            >
              <option value="cod">Thanh toán khi nhận hàng (COD)</option>
              <option value="credit_card">Thẻ tín dụng</option>
              <option value="bank_transfer">Chuyển khoản ngân hàng</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuyNowDialog(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmBuyNow}
            variant="contained"
            disabled={!formData.shipping_address || loading}
          >
            {loading ? <CircularProgress size={20} /> : "Xác nhận đặt hàng"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MotopartDetail;
