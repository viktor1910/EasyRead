import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useOrders, useUpdateOrderStatus } from "./service";

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ShippingManagement = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  // Define status groups
  const historyStatuses = ["completed", "cancelled"];
  const incomingStatuses = ["pending", "paid", "shipped"];
  const currentStatuses = currentTab === 0 ? incomingStatuses : historyStatuses;

  // Debounce search keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
      setPage(0); // Reset to first page when search term changes
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Reset page when tab changes
  useEffect(() => {
    setPage(0);
  }, [currentTab]);

  // Fetch orders with React Query
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useOrders({
    page: page + 1,
    limit: rowsPerPage,
    search: debouncedSearchKeyword || undefined,
    status: currentStatuses,
  });

  // Update order status mutation
  const updateStatusMutation = useUpdateOrderStatus();

  const orders = ordersResponse?.data || [];
  const totalOrders = ordersResponse?.total || 0;

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
  };

  const handleOpenDetailModal = (order) => {
    setSelectedOrder(order);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedOrder(null);
  };

  const handleOpenStatusModal = (order, event) => {
    event.stopPropagation(); // Prevent row click event
    setOrderToUpdate(order);
    setNewStatus(order.status);
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setOrderToUpdate(null);
    setNewStatus("");
  };

  const handleConfirmStatusUpdate = async () => {
    if (orderToUpdate && newStatus && newStatus !== orderToUpdate.status) {
      try {
        await updateStatusMutation.mutateAsync({
          id: orderToUpdate.id,
          status: newStatus,
        });
        handleCloseStatusModal();
        // Refresh data will be handled by React Query invalidation
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    } else {
      handleCloseStatusModal();
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

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "paid":
        return "Đã thanh toán";
      case "shipped":
        return "Đã gửi hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const renderOrdersTable = () => (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Có lỗi xảy ra khi tải dữ liệu: {error.message}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Tổng tiền</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell>Địa chỉ giao hàng</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Chưa có đơn hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    hover
                    onClick={() => handleOpenDetailModal(order)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.user?.name || "N/A"}</TableCell>
                    <TableCell>{order.user?.email || "N/A"}</TableCell>
                    <TableCell align="right">
                      {parseFloat(order.total_price).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusText(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {order.shipping_address || "Chưa có địa chỉ"}
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDetailModal(order)}
                        size="small"
                        title="Xem chi tiết"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {currentTab === 0 && ( // Only show edit for incoming orders
                        <IconButton
                          color="secondary"
                          onClick={(event) =>
                            handleOpenStatusModal(order, event)
                          }
                          size="small"
                          title="Cập nhật trạng thái"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOrders}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
          />
        </TableContainer>
      )}
    </>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Quản lý đơn hàng</Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchKeyword}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchKeyword && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    title="Xóa tìm kiếm"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Đơn hàng đang xử lý" />
          <Tab label="Lịch sử đơn hàng" />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        {renderOrdersTable()}
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        {renderOrdersTable()}
      </TabPanel>

      {/* Order Detail Modal */}
      <Dialog
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Thông tin khách hàng:</strong>
              </Typography>
              <Box sx={{ mb: 2, pl: 2 }}>
                <Typography>
                  Tên: {selectedOrder.user?.name || "N/A"}
                </Typography>
                <Typography>
                  Email: {selectedOrder.user?.email || "N/A"}
                </Typography>
                <Typography>
                  Vai trò: {selectedOrder.user?.role || "N/A"}
                </Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Thông tin đơn hàng:</strong>
              </Typography>
              <Box sx={{ mb: 2, pl: 2 }}>
                <Typography>
                  Tổng tiền:{" "}
                  {parseFloat(selectedOrder.total_price).toLocaleString(
                    "vi-VN"
                  )}{" "}
                  VNĐ
                </Typography>
                <Typography>
                  Trạng thái:{" "}
                  <Chip
                    label={getStatusText(selectedOrder.status)}
                    color={getStatusColor(selectedOrder.status)}
                    size="small"
                  />
                </Typography>
                <Typography>
                  Địa chỉ giao hàng:{" "}
                  {selectedOrder.shipping_address || "Chưa có địa chỉ"}
                </Typography>
                <Typography>
                  Phương thức thanh toán:{" "}
                  {selectedOrder.payment_method || "Chưa xác định"}
                </Typography>
                <Typography>
                  Ngày tạo:{" "}
                  {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                </Typography>
              </Box>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Danh sách sản phẩm:</strong>
                  </Typography>
                  <TableContainer component={Paper} sx={{ mt: 1 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Phụ tùng</TableCell>
                          <TableCell align="center">Số lượng</TableCell>
                          <TableCell align="right">Đơn giá</TableCell>
                          <TableCell align="right">Thành tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.motopart?.name || "N/A"}</TableCell>
                            <TableCell align="center">
                              {item.quantity}
                            </TableCell>
                            <TableCell align="right">
                              {parseFloat(item.price).toLocaleString("vi-VN")}{" "}
                              VNĐ
                            </TableCell>
                            <TableCell align="right">
                              {(
                                parseFloat(item.price) * item.quantity
                              ).toLocaleString("vi-VN")}{" "}
                              VNĐ
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailModal}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog
        open={openStatusModal}
        onClose={handleCloseStatusModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Cập nhật trạng thái đơn hàng #{orderToUpdate?.id}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={newStatus}
                label="Trạng thái"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="pending">Chờ xử lý</MenuItem>
                <MenuItem value="paid">Đã thanh toán</MenuItem>
                <MenuItem value="shipped">Đã gửi hàng</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="cancelled">Hủy đơn</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusModal}>Hủy</Button>
          <Button
            onClick={handleConfirmStatusUpdate}
            variant="contained"
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShippingManagement;
