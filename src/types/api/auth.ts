import { BaseEntity } from './common';

// Auth types
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'admin' | 'user';
  email_verified_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
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