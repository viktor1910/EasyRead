import {
  useMotoparts,
  useMotopart,
  useCreateMotopart,
  useUpdateMotopart,
  useDeleteMotopart,
} from "../../../../services/motoparts";

// Re-export với tên cũ để tương thích
export const useMotopartsQuery = useMotoparts;
export const useMotopartQuery = useMotopart;
export const useCreateMotopartMutation = useCreateMotopart;
export const useUpdateMotopartMutation = useUpdateMotopart;
export const useDeleteMotopartMutation = useDeleteMotopart;
