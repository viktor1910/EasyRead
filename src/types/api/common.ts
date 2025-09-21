// Common API response types
export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}