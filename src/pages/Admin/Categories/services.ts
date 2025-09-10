import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../../AxiosConfig';

// Interface cho Category model
export interface Category {
  id?: number;
  name: string;
  slug: string;
  image: string;
}

// Interface cho dữ liệu khi tạo category
export interface CreateCategoryData {
  name: string;
  slug: string;
  image: string;
}

// API function để get all categories
const getCategories = async (): Promise<Category[]> => {
  const response = await AxiosConfig.get('/categories');
  return response.data;
};

// API function để create category
const createCategory = async (categoryData: CreateCategoryData): Promise<Category> => {
  const response = await AxiosConfig.post('/categories', categoryData);
  return response.data;
};

// React Query hook để get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// React Query hook để create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      // Invalidate và refetch categories list sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error creating category:', error);
    },
  });
};