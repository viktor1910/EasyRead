import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryAPI } from "../../../../utils/api";

export const useCategoriesQuery = (options = {}) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryAPI.getAll();
      return response.data || response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

export const useCategoryQuery = (id, options = {}) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryAPI.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoryAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => categoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
