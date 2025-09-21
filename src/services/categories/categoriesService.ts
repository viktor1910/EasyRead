import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { apiRequest } from '../apiUtils';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../types/api';

// API functions using AxiosConfig (preferred)
const getCategories = async (): Promise<Category[]> => {
  const response = await AxiosConfig.get('/categories');
  return response.data;
};

const getCategoryById = async (id: number): Promise<Category> => {
  const response = await AxiosConfig.get(`/categories/${id}`);
  return response.data;
};

const createCategory = async (categoryData: CreateCategoryRequest): Promise<Category> => {
  const formData = new FormData();
  formData.append('name', categoryData.name);
  formData.append('slug', categoryData.slug);
  if (categoryData.description) {
    formData.append('description', categoryData.description);
  }
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

const updateCategory = async (categoryData: UpdateCategoryRequest): Promise<Category> => {
  const { id, ...updateData } = categoryData;
  const formData = new FormData();
  
  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  const response = await AxiosConfig.post(`/categories/${id}/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteCategory = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/categories/${id}`);
};

// Legacy API functions using fetch (for backward compatibility)
const legacyCategoryAPI = {
  getAll: () => apiRequest("/categories"),
  getById: (id: number) => apiRequest(`/categories/${id}`),
  create: (data: any) => {
    const isFormData = data instanceof FormData;
    return apiRequest("/categories", {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  update: (id: number, data: any) => {
    const isFormData = data instanceof FormData;
    return apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  delete: (id: number) =>
    apiRequest(`/categories/${id}`, {
      method: "DELETE",
    }),
};

// React Query hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.removeQueries({ queryKey: ['categories'] });
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
      queryClient.removeQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
    },
  });
};

// Legacy hooks for backward compatibility
export const useCategoriesQuery = (options: any = {}) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await legacyCategoryAPI.getAll();
      return response.data || response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

export const useCategoryQuery = (id: number, options: any = {}) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => legacyCategoryAPI.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => legacyCategoryAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => legacyCategoryAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => legacyCategoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Direct API exports for compatibility
export const categoryAPI = legacyCategoryAPI;