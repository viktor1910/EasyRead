import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
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
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddMotopart from "./components/AddMotopart";
import MotopartDetail from "./components/MotopartDetail";
import { useMotoparts, useDeleteMotopart } from "../../../services/motoparts";

const MotopartManagement = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedMotopart, setSelectedMotopart] = useState(null);
  const [motopartToDelete, setMotopartToDelete] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  // Debounce search keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
      setPage(0); // Reset to first page when search term changes
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Fetch motoparts with React Query
  const {
    data: motopartsResponse,
    isLoading,
    error,
    refetch,
  } = useMotoparts({
    page: page + 1,
    page_size: rowsPerPage,
    search: debouncedSearchKeyword || undefined,
  });

  // Delete motopart mutation
  const deleteMotopartMutation = useDeleteMotopart();

  // New API response shape: { results: [...], pagination: { count, ... } }
  const motoparts = motopartsResponse?.results || motopartsResponse?.data || [];
  const totalMotoparts =
    motopartsResponse?.pagination?.count ??
    motopartsResponse?.total ??
    motoparts.length;

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setSelectedMotopart(null);
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setSelectedMotopart(null);
    setIsEdit(false);
  };

  const handleMotopartSuccess = () => {
    // Refresh motoparts data
    refetch();
  };

  const handleOpenDetailModal = (motopart) => {
    setSelectedMotopart(motopart);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedMotopart(null);
  };

  const handleEdit = (motopart) => {
    setIsEdit(true);
    setSelectedMotopart(motopart);
    setOpenDetailModal(false);
    setOpenAddModal(true);
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

  const handleOpenDeleteModal = (motopart, event) => {
    event.stopPropagation(); // Prevent row click event
    setMotopartToDelete(motopart);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setMotopartToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (motopartToDelete) {
      try {
        await deleteMotopartMutation.mutateAsync(motopartToDelete.id);
        handleCloseDeleteModal();
        // Refresh data will be handled by React Query invalidation
      } catch (error) {
        console.error("Error deleting motopart:", error);
      }
    }
  };

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
        <Typography variant="h4" component="h1">
          Quản lý phụ tùng xe máy
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
        >
          Thêm phụ tùng mới
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm phụ tùng theo tên, nhà cung cấp..."
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
                <IconButton onClick={handleClearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Loading and Error States */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Có lỗi xảy ra khi tải dữ liệu: {error.message}
        </Alert>
      )}

      {/* Motoparts Table */}
      {!isLoading && !error && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="motoparts table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên phụ tùng</TableCell>
                  <TableCell>Nhà cung cấp</TableCell>
                  <TableCell>Năm sản xuất</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Tồn kho</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {motoparts.map((motopart) => (
                  <TableRow
                    key={motopart.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpenDetailModal(motopart)}
                  >
                    <TableCell>{motopart.id}</TableCell>
                    <TableCell>{motopart.name || motopart.title}</TableCell>
                    <TableCell>{motopart.supplier}</TableCell>
                    <TableCell>{motopart.manufacture_year}</TableCell>
                    <TableCell>
                      {motopart.price.toLocaleString("vi-VN")}đ
                      {motopart.discount > 0 && (
                        <span style={{ color: "red", marginLeft: 8 }}>
                          (-{motopart.discount}%)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{motopart.stock}</TableCell>
                    <TableCell>
                      {(() => {
                        const isAvailable =
                          typeof motopart.is_available === "boolean"
                            ? motopart.is_available
                            : motopart.status === "active" ||
                              motopart.status === "available";
                        const color = isAvailable ? "green" : "red";
                        const text = isAvailable ? "Hoạt động" : "Hết hàng";
                        return <span style={{ color }}>{text}</span>;
                      })()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={(e) => handleOpenDeleteModal(motopart, e)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalMotoparts}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </>
      )}

      {/* Add/Edit Motopart Modal */}
      <Dialog
        open={openAddModal}
        onClose={handleCloseAddModal}
        maxWidth="md"
        fullWidth
      >
        <AddMotopart
          open={openAddModal}
          onClose={handleCloseAddModal}
          onSuccess={handleMotopartSuccess}
          motopart={selectedMotopart}
          isEdit={isEdit}
        />
      </Dialog>

      {/* Motopart Detail Modal */}
      <Dialog
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        maxWidth="md"
        fullWidth
      >
        <MotopartDetail
          open={openDetailModal}
          onClose={handleCloseDetailModal}
          motopart={selectedMotopart}
          onEdit={handleEdit}
        />
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa phụ tùng "{motopartToDelete?.name}"? Hành
            động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMotopartMutation.isPending}
          >
            {deleteMotopartMutation.isPending ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MotopartManagement;
