import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest, 
  CategoriesQueryParams,
  CategoryPaginationResponse 
} from '../../types/api';

// API functions using AxiosConfig - Updated to match Django backend
const getCategories = async (params: CategoriesQueryParams = {}): Promise<CategoryPaginationResponse> => {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const response = await AxiosConfig.get(`/categories/${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

const getCategoryById = async (id: number): Promise<Category> => {
  const response = await AxiosConfig.get(`/categories/${id}/`);
  return response.data;
};

const createCategory = async (categoryData: CreateCategoryRequest): Promise<Category> => {
  const requestData = {
    name: categoryData.name,
    slug: categoryData.slug,
    image: categoryData.image || null // Match Django field name
  };
  
  const response = await AxiosConfig.post('/categories/', requestData);
  return response.data;
};

const updateCategory = async (categoryData: UpdateCategoryRequest): Promise<Category> => {
  const { id, ...updateData } = categoryData;
  const requestData = {
    name: updateData.name,
    slug: updateData.slug,
    image: updateData.image || null // Match Django field name
  };
  
  const response = await AxiosConfig.put(`/categories/${id}/`, requestData);
  return response.data;
};

const deleteCategory = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/categories/${id}/`);
};

// React Query hooks - Updated for Django backend
export const useCategories = (params: CategoriesQueryParams = {}, options: any = {}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useCategory = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.removeQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error creating category:', error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', data.id] });
    },
    onError: (error) => {
      console.error('Error updating category:', error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
    },
  });
};