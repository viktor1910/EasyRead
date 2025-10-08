import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
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
  useCreateMotopart,
  useUpdateMotopart,
} from "../../../../../services/motoparts";
import { useCategories } from "../../../../../services/categories";
import { useNotification } from "../../../../../context/NotificationContext/NotificationContext";

const AddMotopart = ({
  open,
  onClose,
  motopart: initialMotopartData,
  isEdit,
  onSuccess,
}) => {
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const { showSuccess, showError } = useNotification();

  // Fetch categories with React Query
  const {
    data: categoriesData,
    isLoading: loadingCategories,
    error: categoriesError,
  } = useCategories({ enabled: open });
  const categories = (categoriesData && categoriesData.results) || [];

  // Create motopart mutation
  const createMotopartMutation = useCreateMotopart();

  // Update motopart mutation
  const updateMotopartMutation = useUpdateMotopart();

  const isLoading =
    createMotopartMutation.isPending || updateMotopartMutation.isPending;

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
      name: "",
      slug: "",
      price: "",
      discount: "",
      stock: "",
      status: "active",
      description: "",
      category: "",
      manufacture_year: new Date().getFullYear(),
      supplier: "",
      image_url: "",
    },
  });

  // Watch title to auto-generate slug
  const watchName = watch("name");
  const watchImageUrl = watch("image_url");

  useEffect(() => {
    if (watchName && !isEdit) {
      const slug = watchName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9 ]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .trim("-"); // Remove leading/trailing hyphens
      setValue("slug", slug);
    }
  }, [watchName, setValue, isEdit]);

  // Update image preview when URL changes
  useEffect(() => {
    const img = watchImageUrl || "";
    if (img && img.trim()) {
      setImagePreview(img);
    } else {
      setImagePreview("");
    }
  }, [watchImageUrl]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setError("");
      setImagePreview("");
      if (initialMotopartData && isEdit) {
        // Populate form with existing data
        reset({
          name: initialMotopartData.name || "",
          slug: initialMotopartData.slug || "",
          price: initialMotopartData.price || "",
          discount: initialMotopartData.discount || "",
          stock: initialMotopartData.stock || "",
          status: initialMotopartData.status || "active",
          description: initialMotopartData.description || "",
          category: initialMotopartData.category?.id || "",
          manufacture_year:
            initialMotopartData.manufacture_year || new Date().getFullYear(),
          supplier: initialMotopartData.supplier || "",
          image_url: initialMotopartData.image_url || "",
        });
        // Set image preview if exists
        if (initialMotopartData.image_url) {
          setImagePreview(initialMotopartData.image_url);
        }
      } else {
        // Reset to default values for new motopart
        reset({
          name: "",
          slug: "",
          price: "",
          discount: "",
          stock: "",
          status: "active",
          description: "",
          category: "",
          manufacture_year: new Date().getFullYear(),
          supplier: "",
          image_url: "",
        });
      }
    }
  }, [open, initialMotopartData, isEdit, reset]);

  const handleClose = () => {
    setError("");
    setImagePreview("");
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      setError("");

      // Prepare form data
      const formData = {
        name: data.name,
        slug: data.slug,
        price: parseFloat(data.price),
        discount: data.discount ? parseFloat(data.discount) : 0,
        stock: parseInt(data.stock),
        status: data.status,
        description: data.description,
        category_id: parseInt(data.category),
        manufacture_year: parseInt(data.manufacture_year),
        supplier: data.supplier,
        image_url: data.image_url || "",
      };

      if (isEdit && initialMotopartData) {
        // Update existing motopart
        await updateMotopartMutation.mutateAsync({
          id: initialMotopartData.id,
          ...formData,
        });
        showSuccess("Cập nhật phụ tùng thành công!");
      } else {
        // Create new motopart
        await createMotopartMutation.mutateAsync(formData);
        showSuccess("Thêm phụ tùng mới thành công!");
      }

      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving motopart:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Có lỗi xảy ra khi ${isEdit ? "cập nhật" : "thêm"} phụ tùng`;
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <>
      <DialogTitle>
        {isEdit ? "Cập nhật phụ tùng" : "Thêm phụ tùng mới"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Motopart Name */}
          <TextField
            autoFocus
            label="Tên phụ tùng *"
            fullWidth
            variant="outlined"
            margin="normal"
            {...register("name", {
              required: "Tên phụ tùng là bắt buộc",
              minLength: {
                value: 3,
                message: "Tên phụ tùng phải có ít nhất 3 ký tự",
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* Slug */}
          <TextField
            label="Slug *"
            fullWidth
            variant="outlined"
            margin="normal"
            {...register("slug", {
              required: "Slug là bắt buộc",
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: "Slug chỉ chứa chữ thường, số và dấu gạch ngang",
              },
            })}
            error={!!errors.slug}
            helperText={
              errors.slug?.message || "Slug được tạo tự động từ tên phụ tùng"
            }
          />

          {/* Supplier */}
          <TextField
            label="Nhà cung cấp *"
            fullWidth
            variant="outlined"
            margin="normal"
            {...register("supplier", {
              required: "Nhà cung cấp là bắt buộc",
            })}
            error={!!errors.supplier}
            helperText={errors.supplier?.message}
          />

          {/* Manufacture Year */}
          <TextField
            label="Năm sản xuất *"
            type="number"
            fullWidth
            variant="outlined"
            margin="normal"
            {...register("manufacture_year", {
              required: "Năm sản xuất là bắt buộc",
              min: {
                value: 1900,
                message: "Năm sản xuất phải từ 1900 trở lên",
              },
              max: {
                value: new Date().getFullYear() + 1,
                message: "Năm sản xuất không được vượt quá năm hiện tại",
              },
            })}
            error={!!errors.manufacture_year}
            helperText={errors.manufacture_year?.message}
          />

          {/* Price */}
          <TextField
            label="Giá *"
            type="number"
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ step: "0.01", min: "0" }}
            {...register("price", {
              required: "Giá là bắt buộc",
              min: {
                value: 0,
                message: "Giá phải lớn hơn 0",
              },
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />

          {/* Discount */}
          <TextField
            label="Giảm giá (%)"
            type="number"
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ min: "0", max: "100" }}
            {...register("discount", {
              min: {
                value: 0,
                message: "Giảm giá phải từ 0%",
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
            label="Số lượng tồn kho *"
            type="number"
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ min: "0" }}
            {...register("stock", {
              required: "Số lượng tồn kho là bắt buộc",
              min: {
                value: 0,
                message: "Số lượng tồn kho phải từ 0",
              },
            })}
            error={!!errors.stock}
            helperText={errors.stock?.message}
          />

          {/* Status */}
          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel>Trạng thái *</InputLabel>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Trạng thái là bắt buộc" }}
              render={({ field }) => (
                <Select {...field} label="Trạng thái *">
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
                  <MenuItem value="out_of_stock">Hết hàng</MenuItem>
                </Select>
              )}
            />
            {errors.status && (
              <FormHelperText>{errors.status.message}</FormHelperText>
            )}
          </FormControl>

          {/* Category */}
          <FormControl fullWidth margin="normal" error={!!errors.category}>
            <InputLabel>Danh mục *</InputLabel>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Danh mục là bắt buộc" }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Danh mục *"
                  disabled={loadingCategories}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.category && (
              <FormHelperText>{errors.category.message}</FormHelperText>
            )}
            {categoriesError && (
              <FormHelperText>Lỗi tải danh mục</FormHelperText>
            )}
          </FormControl>

          {/* Description */}
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
            {...register("description")}
          />

          {/* Image URL Input */}
          <TextField
            label="URL hình ảnh phụ tùng"
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="https://example.com/image.jpg"
            {...register("image_url")}
            error={!!errors.image_url}
            helperText={
              errors.image_url?.message ||
              "Nhập đường dẫn URL đến hình ảnh phụ tùng"
            }
          />

          {/* Image Preview */}
          {imagePreview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Xem trước hình ảnh:
              </Typography>
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  border: "2px dashed #ddd",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  backgroundColor: "#f9f9f9",
                  position: "relative",
                }}
              >
                <img
                  src={imagePreview}
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
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : isEdit ? (
            "Cập nhật"
          ) : (
            "Thêm mới"
          )}
        </Button>
      </DialogActions>
    </>
  );
};

export default AddMotopart;
