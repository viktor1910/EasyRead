import React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";

const MotopartDetail = ({ open, onClose, motopart, onEdit }) => {
  if (!motopart) return null;

  const discountedPrice =
    motopart.discount > 0
      ? motopart.price - (motopart.price * motopart.discount) / 100
      : motopart.price;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "out_of_stock":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Ngừng hoạt động";
      case "out_of_stock":
        return "Hết hàng";
      default:
        return "Không xác định";
    }
  };

  return (
    <>
      <DialogTitle>Chi tiết phụ tùng: {motopart.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Image */}
          {motopart.image_url && (
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <img
                src={motopart.image_url}
                alt={motopart.name}
                style={{
                  maxWidth: "300px",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </Box>
          )}

          {/* Basic Information */}
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Tên phụ tùng
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {motopart.name}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Slug
            </Typography>
            <Typography variant="body1">{motopart.slug}</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Nhà cung cấp
            </Typography>
            <Typography variant="body1">{motopart.supplier}</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Năm sản xuất
            </Typography>
            <Typography variant="body1">{motopart.manufacture_year}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Price Information */}
          <Typography variant="h6" gutterBottom>
            Thông tin giá
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Giá gốc
            </Typography>
            <Typography variant="body1">
              {motopart.price.toLocaleString("vi-VN")}đ
            </Typography>
          </Box>

          {motopart.discount > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Giảm giá
              </Typography>
              <Typography variant="body1" color="error">
                {motopart.discount}%
              </Typography>
            </Box>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Giá sau giảm
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="primary">
              {discountedPrice.toLocaleString("vi-VN")}đ
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Stock and Status */}
          <Typography variant="h6" gutterBottom>
            Tồn kho và trạng thái
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Số lượng tồn kho
            </Typography>
            <Typography variant="body1">{motopart.stock} sản phẩm</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Trạng thái
            </Typography>
            <Chip
              label={getStatusLabel(motopart.status)}
              color={getStatusColor(motopart.status)}
              size="small"
            />
          </Box>

          {/* Category */}
          {motopart.category && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Danh mục
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  {typeof motopart.category === "object"
                    ? motopart.category.name
                    : motopart.category}
                </Typography>
              </Box>
            </>
          )}

          {/* Description */}
          {motopart.description && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Mô tả
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {motopart.description}
              </Typography>
            </>
          )}

          {/* Timestamps */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Thông tin hệ thống
          </Typography>

          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ID
            </Typography>
            <Typography variant="body1">{motopart.id}</Typography>
          </Box>

          {motopart.created_at && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Ngày tạo
              </Typography>
              <Typography variant="body1">
                {new Date(motopart.created_at).toLocaleDateString("vi-VN")}
              </Typography>
            </Box>
          )}

          {motopart.updated_at && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Ngày cập nhật
              </Typography>
              <Typography variant="body1">
                {new Date(motopart.updated_at).toLocaleDateString("vi-VN")}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button
          onClick={() => onEdit(motopart)}
          variant="contained"
          color="primary"
        >
          Chỉnh sửa
        </Button>
      </DialogActions>
    </>
  );
};

export default MotopartDetail;
