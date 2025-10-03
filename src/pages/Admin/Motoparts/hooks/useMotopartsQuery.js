import {
  useMotoparts,
  useMotopart,
  useCreateMotopart,
  useUpdateMotopart,
  useDeleteMotopart,
} from "../../../../services/motoparts/motopartsService";

// Re-export với tên cũ để tương thích với backend đã cập nhật
export const useMotopartsQuery = useMotoparts;
export const useMotopartQuery = useMotopart; // Đã implement với DetailView
export const useCreateMotopartMutation = useCreateMotopart;
export const useUpdateMotopartMutation = useUpdateMotopart; // Đã implement với DetailView
export const useDeleteMotopartMutation = useDeleteMotopart; // Đã implement với DetailView
