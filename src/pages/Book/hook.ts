import { useQuery } from '@tanstack/react-query';
import AxiosConfig from '../../AxiosConfig';

export interface BookDetail {
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
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    id: number;
    name: string;
    slug: string;
  };
}

export const useGetBookDetail = (bookId: string | number) => {
  return useQuery<BookDetail>({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const res = await AxiosConfig.get<BookDetail>(`/books/${bookId}`);
      console.log(res.data);
      return res.data;
    },
    enabled: !!bookId,
  });
};
