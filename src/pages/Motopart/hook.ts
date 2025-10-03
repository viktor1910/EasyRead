import { useQuery } from '@tanstack/react-query';
import { Motopart, MotopartPaginationResponse } from '../../types/api';
import { useMotoparts, useMotopart } from '../../services/motoparts/motopartsService';

// Updated to use the proper DetailView implementation
export const useGetMotopartDetail = (id: number) => {
  return useMotopart(id);
};

// Alternative: Use the main motoparts list to find specific item (for slug-based search)
export const useGetMotopartFromList = (slug: string) => {
  const { data: motopartsResponse, ...queryState } = useMotoparts({
    search: slug, // Use search to find by name/description
    page_size: 1, // Limit to 1 result
  });

  const response = motopartsResponse as MotopartPaginationResponse | undefined;
  const motopart = response?.results?.find((item: Motopart) => 
    item.slug === slug || item.name.toLowerCase().includes(slug.toLowerCase())
  ) || null;

  return {
    data: motopart,
    ...queryState,
  };
};