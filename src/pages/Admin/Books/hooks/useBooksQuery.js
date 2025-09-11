import {
  useBooks,
  useBook,
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
} from "../services";

// Re-export với tên cũ để tương thích
export const useBooksQuery = useBooks;
export const useBookQuery = useBook;
export const useCreateBookMutation = useCreateBook;
export const useUpdateBookMutation = useUpdateBook;
export const useDeleteBookMutation = useDeleteBook;
