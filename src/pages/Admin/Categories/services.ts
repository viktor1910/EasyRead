import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../../AxiosConfig';

// Interface cho Category model
export interface Category {
  id?: number;
  name: string;
  slug: string;
  image: string; // Relative path từ server
  image_url: string; // Full URL từ server
  created_at: string;
  updated_at: string;
}

// Interface cho dữ liệu khi tạo category
export interface CreateCategoryData {
  name: string;
  slug: string;
  image: File | null;
}

// Interface cho dữ liệu khi update category
export interface UpdateCategoryData {
  id: number;
  name: string;
  slug: string;
  image: File | null;
}

// API function để get all categories
const getCategories = async (): Promise<Category[]> => {
  const response = await AxiosConfig.get('/categories');
  return response.data;
};

// API function để create category
const createCategory = async (categoryData: CreateCategoryData): Promise<Category> => {
  const formData = new FormData();
  formData.append('name', categoryData.name);
  formData.append('slug', categoryData.slug);
  if (categoryData.image) {
    formData.append('image', categoryData.image);
  }
  
  const response = await AxiosConfig.post('/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// API function để update category
const updateCategory = async (categoryData: UpdateCategoryData): Promise<Category> => {
  const { id, ...updateData } = categoryData;
  const formData = new FormData();
  formData.append('name', updateData.name);
  formData.append('slug', updateData.slug);
  if (updateData.image) {
    formData.append('image', updateData.image);
  }
  
  const response = await AxiosConfig.put(`/categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// API function để delete category
const deleteCategory = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/categories/${id}`);
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
      // Remove specific query cache if needed
      queryClient.removeQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error creating category:', error);
    },
  });
};

// React Query hook để update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      // Invalidate và refetch categories list sau khi update thành công
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      // Remove specific query cache if needed
      queryClient.removeQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error updating category:', error);
    },
  });
};

// React Query hook để delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // Invalidate và refetch categories list sau khi delete thành công
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      // Remove specific query cache if needed
      queryClient.removeQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
    },
  });
};