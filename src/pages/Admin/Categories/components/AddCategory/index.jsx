import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useCreateCategory } from "../../services";

const AddCategoryModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = "add",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
  });

  const createCategoryMutation = useCreateCategory();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        image: initialData.image || "",
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        image: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9 ]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .trim("-"); // Remove leading/trailing hyphens

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: slug,
      }));
    }
  };

  const handleSubmit = async () => {
    if (mode === "add") {
      // Sử dụng react-query mutation để create category
      try {
        await createCategoryMutation.mutateAsync({
          name: formData.name,
          slug: formData.slug,
          image: formData.image,
        });

        // Reset form và đóng modal sau khi thành công
        setFormData({
          name: "",
          slug: "",
          image: "",
        });
        onClose();
      } catch (error) {
        console.error("Error creating category:", error);
        // Có thể thêm thông báo lỗi cho user ở đây
      }
    } else {
      // Giữ nguyên logic cũ cho update mode
      onSubmit({
        id: initialData?.id,
        ...formData,
      });
      setFormData({
        name: "",
        slug: "",
        image: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "add" ? "Thêm danh mục mới" : "Cập nhật danh mục"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            pt: 2,
            "& .MuiTextField-root": { mb: 2 },
          }}
          noValidate
          onSubmit={(e) => e.preventDefault()}
        >
          <TextField
            name="name"
            autoFocus
            label="Tên danh mục"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
            error={!formData.name.trim()}
            helperText={
              !formData.name.trim() ? "Tên danh mục không được để trống" : ""
            }
          />
          <TextField
            name="slug"
            label="Slug (URL-friendly name)"
            type="text"
            fullWidth
            value={formData.slug}
            onChange={handleChange}
            required
            error={!formData.slug.trim()}
            helperText={
              !formData.slug.trim()
                ? "Slug không được để trống"
                : "Slug được tự động tạo từ tên danh mục"
            }
          />
          <TextField
            name="image"
            label="URL hình ảnh"
            type="url"
            fullWidth
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            helperText="Paste URL của hình ảnh danh mục"
          />

          {/* Image Preview */}
          {formData.image && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Xem trước hình ảnh:
              </Typography>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  border: "2px dashed #ddd",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <Box
                  sx={{
                    display: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    color: "text.secondary",
                    fontSize: "12px",
                    textAlign: "center",
                    px: 1,
                  }}
                >
                  Không thể tải hình ảnh
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !formData.name.trim() ||
            !formData.slug.trim() ||
            createCategoryMutation.isPending
          }
          startIcon={
            createCategoryMutation.isPending && mode === "add" ? (
              <CircularProgress size={20} />
            ) : null
          }
        >
          {createCategoryMutation.isPending && mode === "add"
            ? "Đang thêm..."
            : mode === "add"
            ? "Thêm"
            : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryModal;
