import { useQuery } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';

export interface MotopartDetail {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  description: string;
  image_url: string;
  category_id: number;
  manufacture_year: number;
  supplier: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
  };
}

const fetchMotopartDetail = async (id: string): Promise<MotopartDetail> => {
  try {
    const response = await AxiosConfig.get(`/motoparts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useGetMotopartDetail = (id: string) => {
  return useQuery({
    queryKey: ['motopart', id],
    queryFn: () => fetchMotopartDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};