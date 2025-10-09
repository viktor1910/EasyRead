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
  Rating,
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
    <Box
      display="flex"
      justifyContent="center"
      gap={4}
      p="32px 16px"
      bgcolor="#fff"
      minHeight="100vh"
    >
      {/* Left: Image */}
      <Box
        flex="0 0 340px"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <img
          src={
            motopart.image_full_url ||
            motopart.image_url ||
            "/placeholder-motopart.jpg"
          }
          alt={motopart.name}
          width={320}
          height={400}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      </Box>

      {/* Middle: Info */}
      <Box flex="1 1 0" maxWidth={520} px={3}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {motopart.name}
        </Typography>

        <Box mb={1} display="flex" gap={1}>
          <Chip label="FREESHIP XTRA" color="primary" size="small" />
          <Chip label="30 NGÀY ĐỔI TRẢ" color="success" size="small" />
          <Chip label="CHÍNH HÃNG" color="warning" size="small" />
        </Box>

        <Box mb={1}>
          <span>Nhà cung cấp: </span>
          <span>{motopart.supplier || "Chưa cập nhật"}</span>
        </Box>
        <Box mb={1}>
          <span>Năm sản xuất: </span>
          <span>{motopart.manufacture_year}</span>
        </Box>
        <Box mb={1}>
          <span>Danh mục: </span>
          <span>{motopart.category?.name || "Chưa phân loại"}</span>
        </Box>
        <Box mb={1}>
          <span>Tình trạng: </span>
          <Chip
            label={motopart.stock > 0 ? "Còn hàng" : "Hết hàng"}
            color={motopart.stock > 0 ? "success" : "error"}
            size="small"
          />
        </Box>

        <Box mb={1} display="flex" alignItems="center" gap={2}>
          {motopart.discount && (
            <Typography
              fontSize={20}
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              {motopart.price.toLocaleString("vi-VN")}đ
            </Typography>
          )}
          <Typography fontSize={28} fontWeight={600} color="#d0011b">
            {finalPrice.toLocaleString("vi-VN")}đ
          </Typography>
          {motopart.discount && (
            <Chip label={`-${motopart.discount}%`} color="error" size="small" />
          )}
        </Box>

        <Box mb={2} display="flex" alignItems="center" gap={1}>
          <Rating value={5} readOnly size="small" />
          <span>(4 đánh giá)</span>
        </Box>

        <Card
          variant="outlined"
          sx={{ background: "#fafafa", mb: 2, p: 2, boxShadow: "none" }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <AccessTimeOutlinedIcon sx={{ mr: 1 }} />
            Giao đến <b>TP. Hạ Long, P. Hồng Hải, Quảng Ninh</b>
          </Box>
          <Box>
            <span style={{ color: "#52c41a" }}>Miễn phí</span> vận chuyển cho
            đơn từ 45k
          </Box>
        </Card>

        <Card
          variant="outlined"
          sx={{ background: "#fafafa", p: 2, boxShadow: "none" }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <CreditCardOutlinedIcon sx={{ mr: 1 }} />
            Ưu đãi thẻ & chương trình
          </Box>
          <Box display="flex" alignItems="center">
            <ShoppingCartOutlinedIcon sx={{ mr: 1 }} />
            Mua trước trả sau
          </Box>
        </Card>

        {motopart.description && (
          <Card variant="outlined" sx={{ mt: 2, p: 2, boxShadow: "none" }}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              Mô tả sản phẩm
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {motopart.description}
            </Typography>
          </Card>
        )}
      </Box>

      {/* Right: Purchase */}
      <Box
        flex="0 0 320px"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
      >
        <Card sx={{ p: 2 }}>
          <Typography fontSize={20} fontWeight={600} color="#d0011b" mb={2}>
            {finalPrice.toLocaleString("vi-VN")}đ
          </Typography>
          <Box mb={2} display="flex" alignItems="center" gap={1}>
            <span>Số lượng: </span>
            <TextField
              type="number"
              size="small"
              value={quantity}
              inputProps={{
                min: 1,
                max: 99,
                style: { width: 50, textAlign: "center" },
              }}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 99}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ mb: 1, fontWeight: 600 }}
            disabled={motopart.stock <= 0 || loading}
            onClick={handleBuyNow}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : motopart.stock <= 0 ? (
              "Hết hàng"
            ) : (
              "Mua ngay"
            )}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShoppingCartOutlinedIcon />}
            fullWidth
            sx={{ mb: 1 }}
            disabled={motopart.stock <= 0 || loading}
            onClick={handleAddToCart}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : motopart.stock <= 0 ? (
              "Hết hàng"
            ) : (
              "Thêm vào giỏ"
            )}
          </Button>
          <Button variant="outlined" fullWidth>
            Mua trước trả sau
          </Button>
        </Card>
        <Box mt={2} textAlign="center">
          <div>
            Nhà bán: <b>MotoShop Hà Nội</b>
          </div>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Rating value={5} readOnly size="small" />
            <span>(4 đánh giá)</span>
          </Box>
        </Box>
      </Box>

      {/* Snackbar notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Buy Now Dialog */}
      <Dialog
        open={buyNowDialog}
        onClose={() => setBuyNowDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Mua ngay - {motopart?.name}</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirmBuyNow();
          }}
        >
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Thông tin sản phẩm
                </Typography>
                <Paper sx={{ p: 2 }}>
                  <Box display="flex" gap={2}>
                    <Box
                      component="img"
                      src={motopart?.image_full_url || motopart?.image_url}
                      alt={motopart?.name}
                      sx={{
                        width: 80,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                    <Box flex={1}>
                      <Typography variant="subtitle1" gutterBottom>
                        {motopart?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Nhà cung cấp: {motopart?.supplier}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Danh mục: {motopart?.category?.name}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2">
                          Số lượng: {quantity}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format((finalPrice || 0) * quantity)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

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
                      setFormData((prev) => ({
                        ...prev,
                        payment_method: "cod",
                      }))
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBuyNowDialog(false)} disabled={loading}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.shipping_address}
            >
              {loading ? <CircularProgress size={20} /> : "Xác nhận đặt hàng"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default MotopartDetail;
