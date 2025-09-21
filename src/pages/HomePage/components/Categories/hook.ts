import { useQuery } from '@tanstack/react-query';
import AxiosConfig from '../../../../AxiosConfig';
import { Category } from './types';

export const useGetCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await AxiosConfig.get('/categories');
      return res.data;
    },
  });
}

export const useGetCategoryById = (id: number | string) => {
  return useQuery<Category>({
    queryKey: ['categories', id],
    queryFn: async () => {
      const res = await AxiosConfig.get(`/categories/${id}`);
      return res.data;
    },
    enabled: !!id, // Only run query if id exists
  });
}
