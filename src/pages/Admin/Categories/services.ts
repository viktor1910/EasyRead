// Re-export centralized categories service to avoid duplication
export {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  categoryAPI
} from '../../../services/categories/categoriesService';

// Import and re-export types for backward compatibility
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../types/api/books';
export type { Category, CreateCategoryRequest, UpdateCategoryRequest };

// Legacy aliases for backward compatibility
export interface CreateCategoryData extends CreateCategoryRequest {}
export interface UpdateCategoryData extends UpdateCategoryRequest {}