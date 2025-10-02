import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import axios from "../AxiosConfig";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/orders/");
      setOrders(response.data);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (orderId) => {
    try {
      const response = await axios.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
    } catch (err) {
      setError("Không thể tải chi tiết đơn hàng");
      console.error("Error fetching order detail:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "paid":
        return "info";
      case "shipped":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AccessTimeIcon />;
      case "paid":
        return <ReceiptIcon />;
      case "shipped":
        return <LocalShippingIcon />;
      case "completed":
        return <CheckCircleIcon />;
      case "cancelled":
        return <CancelIcon />;
      default:
        return <ShoppingBagIcon />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "paid":
        return "Đã thanh toán";
      case "shipped":
        return "Đang giao hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <ShoppingBagIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Chưa có đơn hàng nào
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/motoparts")}
            startIcon={<ShoppingBagIcon />}
          >
            Mua sắm ngay
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <ShoppingBagIcon />
        Đơn hàng của tôi
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Danh sách đơn hàng ({orders.length})
      </Typography>

      <Grid container spacing={4}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card
              sx={{
                height: "100%",
                minHeight: "280px",
                cursor: "pointer",
                border:
                  selectedOrder?.id === order.id ? "2px solid" : "1px solid",
                borderColor:
                  selectedOrder?.id === order.id ? "primary.main" : "divider",
                backgroundColor:
                  selectedOrder?.id === order.id
                    ? "primary.50"
                    : "background.paper",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-3px)",
                  transition: "all 0.3s ease-in-out",
                  backgroundColor:
                    selectedOrder?.id === order.id ? "primary.50" : "grey.50",
                },
              }}
              onClick={() => handleViewDetail(order.id)}
            >
              <CardContent
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={3}
                >
                  <Typography variant="h5" color="primary" fontWeight={700}>
                    #{order.id}
                  </Typography>
                  <Chip
                    label={getStatusText(order.status)}
                    color={getStatusColor(order.status)}
                    size="medium"
                    icon={getStatusIcon(order.status)}
                  />
                </Box>

                {/* Date */}
                <Typography
                  variant="body1"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  {formatDate(order.created_at)}
                </Typography>

                {/* Products count and total */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="body1" fontWeight={500}>
                    {order.items?.length || 0} sản phẩm
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight={700}>
                    {formatPrice(order.total_price)}
                  </Typography>
                </Box>

                {/* Address */}
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    flexGrow: 1,
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  {order.shipping_address}
                </Typography>

                {/* Action button */}
                <Button
                  variant={
                    selectedOrder?.id === order.id ? "contained" : "outlined"
                  }
                  size="medium"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetail(order.id);
                  }}
                >
                  {selectedOrder?.id === order.id ? "Đang xem" : "Xem chi tiết"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chi tiết đơn hàng - Hiển thị dưới dạng modal/dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          formatPrice={formatPrice}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getStatusIcon={getStatusIcon}
        />
      )}
    </Container>
  );
};

// Component Dialog chi tiết đơn hàng
const OrderDetailDialog = ({
  open,
  onClose,
  order,
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusText,
  getStatusIcon,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {getStatusIcon(order.status)}
          <Typography variant="h6">Chi tiết đơn hàng #{order.id}</Typography>
          <Chip
            label={getStatusText(order.status)}
            color={getStatusColor(order.status)}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Thông tin đơn hàng */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Thông tin đơn hàng
            </Typography>

            <Paper sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2">Mã đơn hàng:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  #{order.id}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2">Ngày đặt:</Typography>
                <Typography variant="body2">
                  {formatDate(order.created_at)}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2">Trạng thái:</Typography>
                <Chip
                  label={getStatusText(order.status)}
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </Box>

              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2">Phương thức thanh toán:</Typography>
                <Typography variant="body2">
                  {order.payment_method === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : order.payment_method === "bank_transfer"
                    ? "Chuyển khoản ngân hàng"
                    : order.payment_method}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Tổng tiền:</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(order.total_price)}
                </Typography>
              </Box>
            </Paper>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Địa chỉ giao hàng
            </Typography>

            <Paper sx={{ p: 2 }}>
              <Typography variant="body2">{order.shipping_address}</Typography>
            </Paper>
          </Grid>

          {/* Danh sách sản phẩm */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm đã đặt
            </Typography>

            <Paper sx={{ p: 2 }}>
              {order.items?.map((item) => (
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
                        width: 80,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                    <Box flex={1}>
                      <Typography variant="subtitle1" gutterBottom>
                        {item.motopart?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Nhà cung cấp: {item.motopart?.supplier}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Thể loại: {item.motopart?.category?.name}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2">
                          Số lượng: {item.quantity}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrdersPage;
