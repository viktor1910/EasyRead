import { useCategories, useCategory } from '../../../../services/categories/categoriesService';
import { Category } from '../../../../types/api';

// Re-export centralized hooks with legacy names for backward compatibility
export const useGetCategories = (params = {}) => {
  return useCategories(params);
};

export const useGetCategoryById = (id: number | string) => {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return useCategory(numericId);
};
