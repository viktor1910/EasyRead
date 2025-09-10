import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext/CartContext";

const CartPage = () => {
  const { cart, loading, error, updateQuantity, removeItem, clearCart } =
    useCart();
  const [updating, setUpdating] = useState({});
  const [checkoutDialog, setCheckoutDialog] = useState(false);
  const navigate = useNavigate();

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

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleCheckout = () => {
    setCheckoutDialog(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        {error.includes("đăng nhập") ? (
          <Button variant="contained" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
        ) : (
          <Button variant="contained" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        )}
      </Container>
    );
  }

  // Kiểm tra cart có tồn tại và có items không
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Giỏ hàng trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            startIcon={<ShoppingBagIcon />}
          >
            Tiếp tục mua sắm
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <ShoppingCartIcon />
        Giỏ hàng của bạn
      </Typography>

      {/* Danh sách sản phẩm */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              Sản phẩm ({cart.items.length} loại sản phẩm, {cart.items_count}{" "}
              sản phẩm)
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClearCart}
              disabled={cart.items.length === 0}
            >
              Xóa tất cả
            </Button>
          </Box>

          {cart.items.map((item) => (
            <Box key={item.id}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  py: 2,
                  minHeight: 140,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                }}
              >
                {/* Hình ảnh sách */}
                <Box sx={{ flex: "0 0 120px", minWidth: 120 }}>
                  <Box
                    component="img"
                    src={item.book?.image_full_url || "/placeholder-book.jpg"}
                    alt={item.book?.title}
                    sx={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 1,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                </Box>

                {/* Thông tin sách */}
                <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontSize: "1.1rem", lineHeight: 1.3 }}
                  >
                    {item.book?.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Tác giả: {item.book?.author?.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Thể loại: {item.book?.category?.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mt: 1, fontWeight: "bold" }}
                  >
                    {formatPrice(item.unit_price)}
                  </Typography>
                </Box>

                {/* Điều chỉnh số lượng */}
                <Box
                  sx={{
                    flex: "0 0 140px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={updating[item.id] || item.quantity <= 1}
                      sx={{
                        border: "1px solid #e0e0e0",
                        "&:hover": { backgroundColor: "grey.100" },
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>

                    <TextField
                      size="small"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        if (value >= 0) {
                          handleUpdateQuantity(item.id, value);
                        }
                      }}
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center", width: "50px" },
                      }}
                      disabled={updating[item.id]}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          width: "70px",
                          height: "32px",
                        },
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={updating[item.id]}
                      sx={{
                        border: "1px solid #e0e0e0",
                        "&:hover": { backgroundColor: "grey.100" },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Tổng: {formatPrice(item.total)}
                  </Typography>
                </Box>

                {/* Nút xóa */}
                <Box
                  sx={{
                    flex: "0 0 60px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={updating[item.id]}
                    sx={{
                      border: "1px solid #ffebee",
                      backgroundColor: "#ffebee",
                      "&:hover": {
                        backgroundColor: "#ffcdd2",
                        borderColor: "#f44336",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Tóm tắt đơn hàng */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tóm tắt đơn hàng
          </Typography>

          <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {cart.items.length} loại sản phẩm
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {cart.items_count} sản phẩm
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography>Tạm tính:</Typography>
            <Typography>{formatPrice(cart.subtotal)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography>Phí vận chuyển:</Typography>
            <Typography color="success.main">Miễn phí</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h6">Tổng cộng:</Typography>
            <Typography variant="h6" color="primary">
              {formatPrice(cart.subtotal)}
            </Typography>
          </Box>

          <Box
            display="flex"
            gap={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              startIcon={<LocalShippingIcon />}
            >
              Thanh toán
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate("/")}
              startIcon={<ShoppingBagIcon />}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog thanh toán */}
      <CheckoutDialog
        open={checkoutDialog}
        onClose={() => setCheckoutDialog(false)}
        cart={cart}
        onSuccess={() => {
          setCheckoutDialog(false);
          navigate("/orders");
        }}
      />
    </Container>
  );
};

// Component Dialog thanh toán
const CheckoutDialog = ({ open, onClose, cart, onSuccess }) => {
  const { checkout } = useCart();
  const [formData, setFormData] = useState({
    shipping_address: "",
    payment_method: "cod",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await checkout(formData);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || "Có lỗi xảy ra khi thanh toán");
    }

    setLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Thanh toán đơn hàng</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Thông tin giao hàng */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Thông tin giao hàng
              </Typography>

              <TextField
                fullWidth
                label="Địa chỉ giao hàng"
                multiline
                rows={4}
                value={formData.shipping_address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shipping_address: e.target.value,
                  }))
                }
                required
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle1" gutterBottom>
                Phương thức thanh toán
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label="Thanh toán khi nhận hàng (COD)"
                  color={
                    formData.payment_method === "cod" ? "primary" : "default"
                  }
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, payment_method: "cod" }))
                  }
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label="Chuyển khoản ngân hàng"
                  color={
                    formData.payment_method === "bank_transfer"
                      ? "primary"
                      : "default"
                  }
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      payment_method: "bank_transfer",
                    }))
                  }
                  sx={{ mr: 1, mb: 1 }}
                />
              </Box>
            </Grid>

            {/* Tóm tắt đơn hàng */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Tóm tắt đơn hàng
              </Typography>

              <Paper sx={{ p: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {cart?.items?.length} loại sản phẩm
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cart?.items_count} sản phẩm
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                {cart?.items?.map((item) => (
                  <Box
                    key={item.id}
                    display="flex"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2">
                      {item.book?.title} x {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      {formatPrice(item.total)}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Tổng cộng:</Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(cart?.subtotal)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.shipping_address}
          >
            {loading ? <CircularProgress size={20} /> : "Xác nhận thanh toán"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CartPage;
