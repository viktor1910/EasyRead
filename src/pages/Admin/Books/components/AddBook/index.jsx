import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  useCreateBookMutation,
  useUpdateBookMutation,
} from "../../hooks/useBooksQuery";
import { useCategoriesQuery } from "../../hooks/useCategoriesQuery";
import { useNotification } from "../../../../../context/NotificationContext/NotificationContext";

const AddBook = ({
  open,
  handleClose,
  bookData: initialBookData,
  isEdit,
  onSuccess,
}) => {
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const { showSuccess, showError } = useNotification();

  // Fetch categories with React Query
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoriesError,
  } = useCategoriesQuery({ enabled: open });

  // Create book mutation
  const createBookMutation = useCreateBookMutation();

  // Update book mutation
  const updateBookMutation = useUpdateBookMutation();

  const isLoading =
    createBookMutation.isPending || updateBookMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      price: "",
      discount: "",
      stock: "",
      status: "available",
      description: "",
      category_id: "",
      author_id: "", // Add author_id field
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setError("");
      setImageFile(null);
      setImagePreview("");
      if (initialBookData && isEdit) {
        // Populate form with existing data
        Object.keys(initialBookData).forEach((key) => {
          setValue(key, initialBookData[key]);
        });
        // Set image preview if exists
        if (initialBookData.image_url) {
          setImagePreview(initialBookData.image_url);
        }
      } else {
        reset();
      }
    }
  }, [open, initialBookData, isEdit, setValue, reset]);

  // Auto-generate slug from title
  const titleValue = watch("title");
  useEffect(() => {
    if (titleValue && !isEdit) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [titleValue, isEdit, setValue]);

  // Handle categories error
  useEffect(() => {
    if (categoriesError) {
      showError("Không thể tải danh sách thể loại");
    }
  }, [categoriesError, showError]);

  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setError("");

    // Prepare book data theo interface mới
    const bookData = {
      title: data.title,
      slug: data.slug,
      price: parseFloat(data.price) || 0,
      discount: parseFloat(data.discount) || 0,
      stock: parseInt(data.stock) || 0,
      status: data.status,
      description: data.description || "",
      category_id: parseInt(data.category_id),
      author_id: parseInt(data.author_id), // Add author_id
      image: imageFile,
    };

    if (isEdit && initialBookData?.id) {
      updateBookMutation.mutate(
        {
          id: initialBookData.id,
          ...bookData,
        },
        {
          onSuccess: () => {
            showSuccess("Cập nhật sách thành công!");
            if (onSuccess) onSuccess();
            handleClose();
            reset();
            setImageFile(null);
            setImagePreview("");
          },
          // Error sẽ được handle bởi global error handler
        }
      );
    } else {
      createBookMutation.mutate(bookData, {
        onSuccess: () => {
          showSuccess("Thêm sách thành công!");
          if (onSuccess) onSuccess();
          handleClose();
          reset();
          setImageFile(null);
          setImagePreview("");
        },
        // Error sẽ được handle bởi global error handler
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? "Chỉnh sửa sách" : "Thêm sách mới"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            {/* Title */}
            <TextField
              fullWidth
              label="Tên sách *"
              {...register("title", { required: "Tên sách là bắt buộc" })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            {/* Slug */}
            <TextField
              fullWidth
              label="Đường dẫn (Slug) *"
              {...register("slug", { required: "Slug là bắt buộc" })}
              error={!!errors.slug}
              helperText={
                errors.slug?.message ||
                "Đường dẫn sẽ được tự động tạo từ tên sách"
              }
            />

            {/* Status */}
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Trạng thái *</InputLabel>
              <Select
                label="Trạng thái *"
                {...register("status", {
                  required: "Trạng thái là bắt buộc",
                })}
              >
                <MenuItem value="available">Còn hàng</MenuItem>
                <MenuItem value="out_of_stock">Hết hàng</MenuItem>
              </Select>
              {errors.status && (
                <FormHelperText>{errors.status.message}</FormHelperText>
              )}
            </FormControl>

            {/* Price */}
            <TextField
              fullWidth
              label="Giá *"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              {...register("price", {
                required: "Giá là bắt buộc",
                min: { value: 0, message: "Giá phải lớn hơn hoặc bằng 0" },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            {/* Discount */}
            <TextField
              fullWidth
              label="Giảm giá (%)"
              type="number"
              inputProps={{ min: 0, max: 100, step: "0.01" }}
              {...register("discount", {
                min: {
                  value: 0,
                  message: "Giảm giá phải lớn hơn hoặc bằng 0",
                },
                max: {
                  value: 100,
                  message: "Giảm giá không được vượt quá 100%",
                },
              })}
              error={!!errors.discount}
              helperText={errors.discount?.message}
            />

            {/* Stock */}
            <TextField
              fullWidth
              label="Số lượng tồn kho *"
              type="number"
              inputProps={{ min: 0, step: 1 }}
              {...register("stock", {
                required: "Số lượng tồn kho là bắt buộc",
                min: {
                  value: 0,
                  message: "Số lượng phải lớn hơn hoặc bằng 0",
                },
              })}
              error={!!errors.stock}
              helperText={errors.stock?.message}
            />

            {/* Category */}
            <FormControl fullWidth error={!!errors.category_id}>
              <InputLabel>Thể loại *</InputLabel>
              <Select
                label="Thể loại *"
                {...register("category_id", {
                  required: "Thể loại là bắt buộc",
                })}
                disabled={loadingCategories}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_id && (
                <FormHelperText>{errors.category_id.message}</FormHelperText>
              )}
              {loadingCategories && (
                <FormHelperText>Đang tải danh sách thể loại...</FormHelperText>
              )}
            </FormControl>

            {/* Author ID */}
            <TextField
              fullWidth
              label="ID Tác giả *"
              type="number"
              inputProps={{ min: 1, step: 1 }}
              {...register("author_id", {
                required: "ID Tác giả là bắt buộc",
                min: { value: 1, message: "ID Tác giả phải lớn hơn 0" },
              })}
              error={!!errors.author_id}
              helperText={errors.author_id?.message}
            />

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Hình ảnh sách
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Chọn hình ảnh
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview && (
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "contain",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Description */}
            <TextField
              fullWidth
              label="Mô tả"
              multiline
              rows={4}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Thêm sách"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBook;
