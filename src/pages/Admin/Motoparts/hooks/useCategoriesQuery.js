import {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../../../services/categories/categoriesService";

// Re-export the main hooks for backward compatibility
export const useCategoriesQuery = useCategories;
export { useCategory, useCreateCategory, useUpdateCategory, useDeleteCategory };

// Legacy named exports
export { useCreateCategory as useCreateCategoryMutation };
export { useUpdateCategory as useUpdateCategoryMutation };
export { useDeleteCategory as useDeleteCategoryMutation };
