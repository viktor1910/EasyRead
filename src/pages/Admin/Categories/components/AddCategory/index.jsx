import React, { useEffect, useState } from "react";
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
  IconButton,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useCreateCategory, useUpdateCategory } from "../../services";

const AddCategoryModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = "add",
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      image: null,
    },
    mode: "onChange",
  });

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const watchName = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (watchName) {
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
  }, [watchName, setValue]);

  // Set initial data when modal opens
  useEffect(() => {
    if (open) {
      if (initialData && mode === "edit") {
        reset({
          name: initialData.name || "",
          slug: initialData.slug || "",
          image: null,
        });
        // Set image preview if editing and has existing image URL
        if (
          initialData.image_url &&
          typeof initialData.image_url === "string"
        ) {
          setImagePreview(initialData.image_url);
        }
      } else {
        reset({
          name: "",
          slug: "",
          image: null,
        });
        setImagePreview(null);
        setSelectedImage(null);
      }
    }
  }, [initialData, mode, open, reset]);

  // Handle image file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh!");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File không được vượt quá 5MB!");
        return;
      }

      setSelectedImage(file);
      setValue("image", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setValue("image", null);
  };

  const onSubmitForm = async (data) => {
    if (mode === "add") {
      // Sử dụng react-query mutation để create category
      try {
        await createCategoryMutation.mutateAsync({
          name: data.name,
          slug: data.slug,
          image: selectedImage,
        });

        // Reset form và đóng modal sau khi thành công
        reset();
        setImagePreview(null);
        setSelectedImage(null);
        onClose();
      } catch (error) {
        console.error("Error creating category:", error);
        // Có thể thêm thông báo lỗi cho user ở đây
      }
    } else {
      // Sử dụng react-query mutation để update category
      try {
        await updateCategoryMutation.mutateAsync({
          id: initialData?.id,
          name: data.name,
          slug: data.slug,
          image: selectedImage,
        });

        // Reset form và đóng modal sau khi thành công
        reset();
        setImagePreview(null);
        setSelectedImage(null);
        onClose();
      } catch (error) {
        console.error("Error updating category:", error);
        // Có thể thêm thông báo lỗi cho user ở đây
      }
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
          onSubmit={handleSubmit(onSubmitForm)}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Tên danh mục không được để trống",
              minLength: {
                value: 2,
                message: "Tên danh mục phải có ít nhất 2 ký tự",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                label="Tên danh mục"
                type="text"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message || ""}
              />
            )}
          />

          <Controller
            name="slug"
            control={control}
            rules={{
              required: "Slug không được để trống",
              minLength: {
                value: 2,
                message: "Slug phải có ít nhất 2 ký tự",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Slug (URL-friendly name)"
                type="text"
                fullWidth
                required
                error={!!errors.slug}
                helperText={
                  errors.slug?.message ||
                  "Slug được tự động tạo từ tên danh mục"
                }
              />
            )}
          />

          {/* Image Upload Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Hình ảnh danh mục
            </Typography>

            <input
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload-button"
              type="file"
              onChange={handleImageChange}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <label htmlFor="image-upload-button">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  sx={{ mb: imagePreview ? 1 : 0 }}
                >
                  Chọn hình ảnh
                </Button>
              </label>

              {imagePreview && (
                <IconButton
                  onClick={handleRemoveImage}
                  color="error"
                  size="small"
                  sx={{ mb: imagePreview ? 1 : 0 }}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
            </Typography>
          </Box>

          {/* Image Preview */}
          {imagePreview && (
            <Box sx={{ mb: 2 }}>
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
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(onSubmitForm)}
          variant="contained"
          disabled={
            !isValid ||
            (mode === "add" && !selectedImage) ||
            createCategoryMutation.isPending ||
            updateCategoryMutation.isPending
          }
          startIcon={
            (createCategoryMutation.isPending && mode === "add") ||
            (updateCategoryMutation.isPending && mode === "edit") ? (
              <CircularProgress size={20} />
            ) : null
          }
        >
          {createCategoryMutation.isPending && mode === "add"
            ? "Đang thêm..."
            : updateCategoryMutation.isPending && mode === "edit"
            ? "Đang cập nhật..."
            : mode === "add"
            ? "Thêm"
            : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryModal;
