// src/types/auth.ts
export type UserRole = 'admin' | 'editor' | 'client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;  // Updated to use UserRole type
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AuthError | null;
}

// Add additional types for registration and login
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;  // Optional since most registrations will be clients
}