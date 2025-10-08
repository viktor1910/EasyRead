import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';
import { 
  Motopart, 
  MotopartsQueryParams, 
  CreateMotopartRequest, 
  UpdateMotopartRequest, 
  MotopartPaginationResponse 
} from '../../types/api';

// API functions using AxiosConfig - Updated to match Django backend
const getMotoparts = async (params: MotopartsQueryParams = {}): Promise<MotopartPaginationResponse> => {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const response = await AxiosConfig.get(`/motoparts/${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

const getMotopartById = async (id: number): Promise<Motopart> => {
  const response = await AxiosConfig.get(`/motoparts/${id}/`);
  return response.data;
};

const createMotopart = async (motopartData: CreateMotopartRequest): Promise<Motopart> => {
  console.log('Creating motopart with data:', motopartData);
  const response = await AxiosConfig.post('/motoparts/', motopartData);
  return response.data;
};

const updateMotopart = async (motopartData: UpdateMotopartRequest): Promise<Motopart> => {
  const { id, ...updateData } = motopartData;
  const requestData = {
    name: updateData.name,
    slug: updateData.slug,
    price: updateData.price,
    discount: updateData.discount,
    stock: updateData.stock,
    status: updateData.status,
    description: updateData.description,
    image_url: updateData.image_url || null,
    category_id: updateData.category_id,
    manufacture_year: updateData.manufacture_year,
    supplier: updateData.supplier,
  };
  
  const response = await AxiosConfig.put(`/motoparts/${id}/`, requestData);
  return response.data;
};

const deleteMotopart = async (id: number): Promise<void> => {
  await AxiosConfig.delete(`/motoparts/${id}/`);
};

// React Query hooks - Updated for complete Django backend
export const useMotoparts = (params: MotopartsQueryParams = {}, options: any = {}) => {
  return useQuery({
    queryKey: ['motoparts', params],
    queryFn: () => getMotoparts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useMotopart = (id: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['motopart', id],
    queryFn: () => getMotopartById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateMotopart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMotopart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
    },
    onError: (error) => {
      console.error('Error creating motopart:', error);
    },
  });
};

export const useUpdateMotopart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMotopart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
      queryClient.invalidateQueries({ queryKey: ['motopart', data.id] });
    },
    onError: (error) => {
      console.error('Error updating motopart:', error);
    },
  });
};

export const useDeleteMotopart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMotopart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoparts'] });
    },
    onError: (error) => {
      console.error('Error deleting motopart:', error);
    },
  });
};