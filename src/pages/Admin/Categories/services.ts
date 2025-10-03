// Re-export centralized categories service to avoid duplication
export {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory
} from '../../../services/categories/categoriesService';

// Import and re-export types for backward compatibility
import type { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CategoriesQueryParams,
  CategoryPaginationResponse 
} from '../../../types/api/books';

export type { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CategoriesQueryParams,
  CategoryPaginationResponse 
};

// Legacy aliases for backward compatibility
export interface CreateCategoryData extends CreateCategoryRequest {}
export interface UpdateCategoryData extends UpdateCategoryRequest {}