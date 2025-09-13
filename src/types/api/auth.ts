export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_in: number;
}