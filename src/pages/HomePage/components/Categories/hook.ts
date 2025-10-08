import { useCategories, useCategory } from '../../../../services/categories/categoriesService';
import { Category } from '../../../../types/api';

// Re-export centralized hooks with legacy names for backward compatibility
export const useGetCategories = (params = {}) => {
  // useCategories returns the full paginated response { pagination, results }
  // map it to return only results (array of categories) for existing components
  const query = useCategories(params);
  return {
    ...query,
    // cast to any because query.data is a paginated response shape
    data: (query.data as any)?.results,
  };
};

export const useGetCategoryById = (id: number | string) => {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return useCategory(numericId);
};
