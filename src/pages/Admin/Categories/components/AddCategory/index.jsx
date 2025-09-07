import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";

const AddCategoryModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = "add",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      id: initialData?.id,
      ...formData,
    });
    setFormData({
      name: "",
      description: "",
    });
    onClose();
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
            name="description"
            label="Mô tả"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name.trim()}
        >
          {mode === "add" ? "Thêm" : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryModal;
