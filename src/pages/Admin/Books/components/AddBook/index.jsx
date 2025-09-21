import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useCreateBook, useUpdateBook } from "../../../../../services/books";
import { useCategories } from "../../../../../services/categories";
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
  } = useCategories({ enabled: open });

  // Create book mutation
  const createBookMutation = useCreateBook();

  // Update book mutation
  const updateBookMutation = useUpdateBook();

  const isLoading =
    createBookMutation.isPending || updateBookMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      price: "",
      discount: "",
      stock: "",
      status: "available", // Only default for new books
      description: "",
      category_id: "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setError("");
      setImageFile(null);
      setImagePreview("");
      if (initialBookData && isEdit) {
        // Populate form with existing data using reset with new values
        reset({
          title: initialBookData.title || "",
          slug: initialBookData.slug || "",
          price: initialBookData.price || "",
          discount: initialBookData.discount || "",
          stock: initialBookData.stock || "",
          status: initialBookData.status || "available",
          description: initialBookData.description || "",
          category_id: initialBookData.category_id || "",
        });
        // Set image preview if exists - use image_full_url first, then image_url as fallback
        if (initialBookData.image_full_url || initialBookData.image_url) {
          setImagePreview(
            initialBookData.image_full_url || initialBookData.image_url
          );
        }
      } else {
        // Reset to default values for new book
        reset({
          title: "",
          slug: "",
          price: "",
          discount: "",
          stock: "",
          status: "available",
          description: "",
          category_id: "",
        });
      }
    }
  }, [open, initialBookData, isEdit, reset]);

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
      // Create preview URL for new uploaded image
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
      author_id: 1, // Always send author_id as 1
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
            <Controller
              name="status"
              control={control}
              rules={{ required: "Trạng thái là bắt buộc" }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Trạng thái *</InputLabel>
                  <Select {...field} label="Trạng thái *">
                    <MenuItem value="available">Còn hàng</MenuItem>
                    <MenuItem value="out_of_stock">Hết hàng</MenuItem>
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />

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
            <Controller
              name="category_id"
              control={control}
              rules={{ required: "Thể loại là bắt buộc" }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Thể loại *</InputLabel>
                  <Select
                    {...field}
                    label="Thể loại *"
                    disabled={loadingCategories}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                  {loadingCategories && (
                    <FormHelperText>
                      Đang tải danh sách thể loại...
                    </FormHelperText>
                  )}
                </FormControl>
              )}
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
                {imageFile ? "Thay đổi hình ảnh" : "Chọn hình ảnh"}
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
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {imageFile ? "Hình ảnh mới" : "Hình ảnh hiện tại"}
                  </Typography>
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
