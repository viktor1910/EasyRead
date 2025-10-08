import { useQuery } from '@tanstack/react-query';
import AxiosConfig from '../../../../AxiosConfig';

// Pagination response type for books
export interface Book {
  id: number;
  title: string;
  slug: string;
  price: number;
  discount: number | null;
  stock: number;
  status: string;
  description: string;
  image_url: string;
  category_id: number;
  author_id: number;
  published_year: number;
  publisher: string;
  created_at: string;
  updated_at: string;
  image_full_url: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface BooksPaginationResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface UseGetBooksParams {
  category_id?: string | number;
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
}

export const useGetBooks = (params: UseGetBooksParams = {}) => {
  const { category_id, pageIndex = 1, pageSize = 10, keyword } = params;
  return useQuery<BooksPaginationResponse<Book>>({
    queryKey: ['motoparts', { category_id, pageIndex, pageSize, keyword }],
    queryFn: async () => {
      const res = await AxiosConfig.get<BooksPaginationResponse<Book>>('/motoparts', {
        params: {
          ...(category_id ? { category_id } : {}),
          ...(keyword ? { keyword } : {}),
          pageIndex,
          pageSize,
        },
      });
      return res.data;
    },
  });
};