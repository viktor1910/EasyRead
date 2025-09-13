export interface Author {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAuthorRequest {
  name: string;
  slug: string;
  bio?: string;
}

export interface UpdateAuthorRequest {
  id: number;
  name: string;
  slug: string;
  bio?: string;
}